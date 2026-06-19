"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { useLocaleState } from "@/components/elsadeq/locale-state";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  preferred_currency: string;
  preferred_language: string;
  created_at: string;
}

export default function AdminUsersPage() {
  const supabase = createClient();
  const { locale } = useLocaleState();
  const [users, setUsers] = React.useState<Profile[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setUsers((data as Profile[]) || []);
        setLoading(false);
      });
  }, [supabase]);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-gold-gradient font-display">
          {locale === "ar" ? "المستخدمون" : "Users"}
        </h1>
      </header>

      {loading ? (
        <div className="text-center py-10 text-sm text-muted-foreground">
          {locale === "ar" ? "جارٍ التحميل..." : "Loading..."}
        </div>
      ) : users.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {locale === "ar" ? "لا يوجد مستخدمون بعد" : "No users yet"}
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card">
          <CardContent className="p-0">
            <div className="divide-y divide-gold/10">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between gap-3 p-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-9 w-9 border border-gold/20">
                      <AvatarFallback className="bg-gold/10 text-gold text-xs font-bold">
                        {u.email.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {u.full_name || u.email}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {u.email} · {new Date(u.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {u.is_admin && (
                      <Badge className="bg-gold/15 text-gold border-gold/30">Admin</Badge>
                    )}
                    <Badge variant="outline" className="text-[10px]">
                      {u.preferred_currency}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
