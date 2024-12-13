import { Alert, AlertSeverity } from "@/types/types";
import { create } from "zustand";

interface AlertState {
  alert: Alert | null;
  showAlert: (message: string, type?: AlertSeverity) => void;
  hideAlert: () => void;
}

const useAlertStore = create<AlertState>((set) => ({
  alert: null,
  showAlert: (message, type = "info") => set({ alert: { message, type } }),
  hideAlert: () => set({ alert: null }),
}));

export default useAlertStore;
