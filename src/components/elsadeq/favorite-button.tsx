"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FavoriteButtonProps {
  itemKey: string;
  className?: string;
  size?: "sm" | "md";
}

/**
 * Toggle favorite button. Requires auth - if not logged in, prompts user.
 */
export function FavoriteButton({ itemKey, className, size = "sm" }: FavoriteButtonProps) {
  const supabase = createClient();
  const [user, setUser] = React.useState<any>(null);
  const [isFav, setIsFav] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUser(user);
      supabase
        .from("user_favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("item_key", itemKey)
        .maybeSingle()
        .then(({ data }) => setIsFav(!!data));
    });
  }, [supabase, itemKey]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.info("سجّل الدخول لحفظ المفضلة / Sign in to save favorites");
      return;
    }
    setLoading(true);
    try {
      if (isFav) {
        await supabase
          .from("user_favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("item_key", itemKey);
        setIsFav(false);
        toast.success("تمت الإزالة من المفضلة");
      } else {
        await supabase
          .from("user_favorites")
          .insert({ user_id: user.id, item_key: itemKey });
        setIsFav(true);
        toast.success("تمت الإضافة للمفضلة");
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label="favorite"
      className={cn(
        "p-1 rounded-full transition-colors",
        isFav
          ? "text-red-500 hover:bg-red-500/10"
          : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10",
        className,
      )}
    >
      <Heart className={cn(iconSize, isFav && "fill-current")} />
    </button>
  );
}
