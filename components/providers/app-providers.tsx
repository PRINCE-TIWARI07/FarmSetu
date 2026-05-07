"use client";

import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <AuthProvider>
        {children}
        <Toaster
          closeButton
          richColors
          position="top-center"
          toastOptions={{
            duration: 3500,
            classNames: {
              toast: "rounded-xl",
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
