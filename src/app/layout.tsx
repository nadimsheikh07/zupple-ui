"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />

      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-screen">
              <div>Loading...</div>
            </div>
          }
        >

          <AppRouterCacheProvider>
            <SessionProvider baseUrl="/ddasd">
              {children}
            </SessionProvider>
          </AppRouterCacheProvider>
        </Suspense>
      </body>
    </html>
  );
}
