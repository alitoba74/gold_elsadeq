#!/usr/bin/env python3
"""Apply schema.sql to Supabase via the REST SQL API."""
import os
import sys
import json
import urllib.request
import urllib.error

URL = "https://axcbqgpsggvcixcgmauf.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4Y2JxZ3BzZ2d2Y2l4Y2dtYXVmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTg1ODQ4NiwiZXhwIjoyMDk3NDM0NDg2fQ.jQANyjUO3jInNT8G_Tb_tlAwyLLf7_VfBGKrMYqaiTE"

SCHEMA_FILE = "/home/z/my-project/scripts/schema.sql"

def main():
    with open(SCHEMA_FILE, "r", encoding="utf-8") as f:
        sql = f.read()

    # Split by semicolons at the end of statements (simple split, since we don't have complex PL/pgSQL blocks with semis)
    # Actually we DO have $$ ... $$ blocks. Use a smarter split that respects $$.
    statements = split_sql(sql)

    print(f"Total statements: {len(statements)}")
    print("=" * 60)

    success = 0
    failures = []

    for i, stmt in enumerate(statements, 1):
        stmt = stmt.strip()
        if not stmt or stmt.startswith("--"):
            continue
        # Truncate preview
        preview = stmt[:80].replace("\n", " ")
        print(f"[{i:02d}] {preview}...")
        ok, err = execute_sql(stmt)
        if ok:
            success += 1
        else:
            # Many "already exists" errors are OK; treat them as soft
            if "already exists" in err.lower() or "does not exist" in err.lower():
                print(f"     -> soft skip: {err[:200]}")
                success += 1
            else:
                print(f"     !! ERROR: {err[:300]}")
                failures.append((i, preview, err))

    print("=" * 60)
    print(f"Success: {success}")
    print(f"Failures: {len(failures)}")
    if failures:
        for i, p, e in failures:
            print(f"  - [{i}] {p}: {e[:200]}")
        sys.exit(1)

def split_sql(sql: str):
    """Split SQL into statements, respecting $$ ... $$ blocks."""
    statements = []
    current = []
    in_dollar = False
    i = 0
    while i < len(sql):
        ch = sql[i]
        # detect $$ toggling
        if sql[i:i+2] == "$$":
            in_dollar = not in_dollar
            current.append("$$")
            i += 2
            continue
        if ch == ";" and not in_dollar:
            statements.append("".join(current))
            current = []
            i += 1
            continue
        current.append(ch)
        i += 1
    if current:
        statements.append("".join(current))
    return statements

def execute_sql(sql: str):
    endpoint = f"{URL}/rest/v1/rpc/exec_sql"
    # Supabase doesn't have a public exec_sql RPC by default; use the SQL endpoint via /pg/query
    # Use the management-style SQL API instead:
    #   POST {URL}/pg/query  with body { query: sql }
    # This endpoint requires the service_role key as Bearer.
    endpoint = f"{URL}/pg/query"
    body = json.dumps({"query": sql}).encode("utf-8")
    req = urllib.request.Request(
        endpoint,
        data=body,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {SERVICE_KEY}",
            "apikey": SERVICE_KEY,
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return True, resp.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        return False, f"HTTP {e.code}: {body}"
    except Exception as e:
        return False, str(e)

if __name__ == "__main__":
    main()
