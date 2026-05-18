// src/hooks/useSidebar.ts
import { create } from "zustand";

interface SidebarState {
  isOpen: boolean; // Mobile drawer state
  isCollapsed: boolean; // Desktop collapse state
  toggleOpen: () => void;
  toggleCollapse: () => void;
}

export const useSidebar = create<SidebarState>((set) => ({
  isOpen: false,
  isCollapsed: false,
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
}));
