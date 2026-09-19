"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Branch, User } from "@/lib/types";
import { setBranchId, setToken } from "@/lib/api/client";

interface SessionState {
  user: User | null;
  branches: Branch[];
  currentBranchId: string | null;
  token: string | null;
  hasHydrated: boolean;
  setSession: (user: User, branches: Branch[], token: string) => void;
  setCurrentBranch: (id: string) => void;
  clearSession: () => void;
  setHasHydrated: (v: boolean) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      branches: [],
      currentBranchId: null,
      token: null,
      hasHydrated: false,
      setSession: (user, branches, token) => {
        setToken(token);
        const first = branches[0];
        const branchId = first ? String(first.id) : null;
        setBranchId(branchId);
        set({ user, branches, currentBranchId: branchId, token });
      },
      setCurrentBranch: (id) => {
        setBranchId(id);
        set({ currentBranchId: id });
      },
      clearSession: () => {
        setToken(null);
        setBranchId(null);
        set({ user: null, branches: [], currentBranchId: null, token: null });
      },
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "gungir.session",
      onRehydrateStorage: () => (state) => {
        if (state?.token) setToken(state.token);
        if (state?.currentBranchId) setBranchId(state.currentBranchId);
        state?.setHasHydrated(true);
      },
      partialize: (s) => ({
        user: s.user,
        branches: s.branches,
        currentBranchId: s.currentBranchId,
        token: s.token,
      }),
    },
  ),
);

export function branchLabel(b: Branch | undefined | null) {
  if (!b) return "Sin sucursal";
  return b.fantasy_name || b.business_name || b.name || `Sucursal ${b.id}`;
}

export function postLoginPath(user: User | null) {
  if (!user) return "/login";
  if (user.is_client) return "/cuenta";
  if (user.is_organization_owner || user.is_superuser) return "/admin";
  return "/local";
}
