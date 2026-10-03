"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User } from "@/types";
import { INITIAL_USER } from "@/lib/db/seed";

interface StoredAccount {
  user: User;
  passwordHash: string;
}

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUserSession: (partial: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_SESSION = "spendwise_active_session";
const STORAGE_KEY_ACCOUNTS = "spendwise_registered_accounts";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session from localStorage on client mount
  useEffect(() => {
    try {
      const savedAccounts = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
      if (!savedAccounts) {
        // Seed default demo user in registered accounts
        const defaultAccounts: StoredAccount[] = [
          {
            user: { ...INITIAL_USER },
            passwordHash: "orbitPass2026",
          },
        ];
        localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(defaultAccounts));
      }

      const activeSession = localStorage.getItem(STORAGE_KEY_SESSION);
      if (activeSession) {
        const parsed = JSON.parse(activeSession);
        setUser(parsed);
        setIsAuthenticated(true);
      } else {
        // Default to demo session for instant preview, but allow user to sign out
        setUser(INITIAL_USER);
        setIsAuthenticated(true);
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(INITIAL_USER));
      }
    } catch (e) {
      console.warn("Could not parse saved auth session, defaulting to initial user", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: "Please enter both email and password." };
    }

    try {
      const accountsJson = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
      const accounts: StoredAccount[] = accountsJson ? JSON.parse(accountsJson) : [];

      const account = accounts.find((acc) => acc.user.email.toLowerCase() === cleanEmail);

      // Allow demo account bypass or check registered accounts
      if (cleanEmail === INITIAL_USER.email.toLowerCase() || (account && account.passwordHash === cleanPass)) {
        const loggedInUser = account ? account.user : INITIAL_USER;
        setUser(loggedInUser);
        setIsAuthenticated(true);
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(loggedInUser));
        return { success: true };
      }

      if (account && account.passwordHash !== cleanPass) {
        return { success: false, error: "Invalid password for this account." };
      }

      // If user isn't found in registered accounts but entered credentials, provide helpful message
      return {
        success: false,
        error: "Account not found. Click 'Create account' or use the demo credentials.",
      };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to authenticate" };
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      const cleanName = name.trim();
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      if (!cleanName || cleanName.length < 2) {
        return { success: false, error: "Full Name must be at least 2 characters." };
      }
      if (!cleanEmail || !cleanEmail.includes("@")) {
        return { success: false, error: "Please enter a valid email address." };
      }
      if (!cleanPass || cleanPass.length < 6) {
        return { success: false, error: "Password must be at least 6 characters." };
      }

      try {
        const accountsJson = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
        const accounts: StoredAccount[] = accountsJson ? JSON.parse(accountsJson) : [];

        const existing = accounts.find((acc) => acc.user.email.toLowerCase() === cleanEmail);
        if (existing) {
          return { success: false, error: "An account with this email already exists. Please sign in." };
        }

        const newUser: User = {
          id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: cleanName,
          email: cleanEmail,
          phone: "+91 90000 00000",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
          accountStatus: "Active",
          memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
          monthlyBudget: 50000,
          currency: "INR",
        };

        accounts.push({ user: newUser, passwordHash: cleanPass });
        localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));

        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(newUser));

        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || "Failed to create account" };
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_SESSION);
    setIsAuthenticated(false);
  }, []);

  const updateUserSession = useCallback((partial: Partial<User>) => {
    setUser((prev) => {
      const updated = { ...prev, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(updated));
        // Also update stored accounts if exists
        const accountsJson = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
        if (accountsJson) {
          const accounts: StoredAccount[] = JSON.parse(accountsJson);
          const index = accounts.findIndex((a) => a.user.id === updated.id);
          if (index !== -1) {
            accounts[index].user = updated;
            localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
          }
        }
      } catch (e) {
        console.warn("Could not save updated user session", e);
      }
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateUserSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

