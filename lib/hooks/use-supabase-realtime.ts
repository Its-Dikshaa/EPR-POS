"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function useSupabaseRealtime(
  table: string,
  onPayload: (payload: any) => void
) {
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`public:${table}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        (payload) => {
          onPayload(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, onPayload]);
}
