"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/zustand/authStore";
import { createClient } from "@/utils/supabase/client";

const AuthSessionSync = () => {
  const getUser = useAuthStore((state) => state.getUser);
  const getSession = useAuthStore((state) => state.getSession);
  const logoutUser = useAuthStore((state) => state.logoutUser);

  useEffect(() => {
    const supabase = createClient();

    const syncSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        logoutUser();
        return;
      }

      getSession(session);
      getUser(session.user);
    };

    syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        logoutUser();
        return;
      }

      getSession(session);
      getUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [getSession, getUser, logoutUser]);

  return null;
};

export default AuthSessionSync;
