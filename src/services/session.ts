import { Profile } from "../utilities/types";
import { WalletType } from "./wallets/wallet";

interface SessionData {
  profile: Profile;
  walletType: WalletType;
}

export const clearSession = (): void => {
  sessionStorage.removeItem("session");
};

export const loadSession = (): SessionData | null => {
  try {
    const sessionData = sessionStorage.getItem("session");
    return sessionData ? JSON.parse(sessionData) : null;
  } catch (e) {
    return null;
  }
};

export const saveSession = (sessionData: SessionData): SessionData => {
  sessionStorage.setItem("session", JSON.stringify(sessionData));
  return sessionData;
};

export const hasSession = (): boolean => !!sessionStorage.getItem("session");