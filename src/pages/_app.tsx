import Login from "@/components/login";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState, type ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLoadingStore } from "@/lib/stores/loading-store";
import pb from "@/lib/pocketbase";
import Loading from "@/components/loading";
import { useAuthStore } from "@/lib/stores/user-store";

// Create a client
const queryClient = new QueryClient();

function IsSignedIn({ children }: { children: ReactNode }) {
  const { user } = useAuthStore();

  if (user === null) {
    return <Login />;
  } else {
    return (
      <>
        <Navbar />
        {children}
      </>
    );
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const { loading } = useLoadingStore();
  const { setUser } = useAuthStore();

  useEffect(() => {
    setUser(pb.authStore.model);
  }, [pb]);

  pb.authStore.onChange((token) => {
    if (token) {
      setUser(pb.authStore.model);
    } else {
      setUser(null);
    }
  });

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <IsSignedIn>
        {loading && <Loading />}
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
          <Toaster />
        </QueryClientProvider>
      </IsSignedIn>
    </ThemeProvider>
  );
}
