import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { MotorcycleProvider } from "@/contexts/MotorcycleContext";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MotoSpin - Discover Random Motorcycles",
  description:
    "Discover random motorcycles and save your favorites. A fun way to explore different motorcycle models and their specifications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AppRouterCacheProvider>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <AuthProvider>
            <MotorcycleProvider>
              {children}
            </MotorcycleProvider>
          </AuthProvider>
        </body>
      </AppRouterCacheProvider>
    </html>
  );
}
