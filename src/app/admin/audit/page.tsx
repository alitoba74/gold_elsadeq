"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminAuditPage() {
  const supabase = createClient();
  const [logs, setLogs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => {
        setLogs(data || []);
        setLoading(false);
      });
  }, [supabase]);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-gold-gradient font-display">
          Audit Log
        </h1>
      </header>

      {loading ? (
        <div className="text-center py-10 text-sm text-muted-foreground">Loading...</div>
      ) : logs.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No logs yet
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card">
          <CardContent className="p-0">
            <div className="divide-y divide-gold/10 max-h-[600px] overflow-y-auto">
              {logs.map((l) => (
                <div key={l.id} className="p-3 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-gold">{l.action}</span>
                    <span className="text-muted-foreground">
                      {new Date(l.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1">
                    {l.entity} {l.entity_id && `· ${l.entity_id}`}
                  </p>
                  {l.details && (
                    <pre className="mt-1 p-2 rounded bg-muted/50 text-[10px] overflow-x-auto">
                      {JSON.stringify(l.details, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
