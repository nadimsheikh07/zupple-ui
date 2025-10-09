"use client";

import { PageContainer } from "@toolpad/core";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { NextAppProvider } from "@toolpad/core/nextjs";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import accountNavigation from "./navigation";

export default function AdminLayout({
  window,
  children,
}: {
  window?: () => Window;
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  const user = session?.user;

  const router = useRouter();
  const pathname = usePathname();
  const demoWindow = window !== undefined ? window() : undefined;

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/auth/signin");
    router.refresh();
  };

  return (
    <NextAppProvider
      navigation={accountNavigation}
      branding={{
        title: "Account Panel",
        homeUrl: "/",
      }}
      router={{
        pathname,
        navigate: (url) => router.push(url.toString()),
        searchParams: new URLSearchParams(),
      }}
      window={demoWindow}
      session={{
        user: user
          ? {
            ...user,
            id: user.id?.toString() || null,
            name: user.name || "",
            email: user.email || "",
            image: user.image ? `/uploads/${user.image}` : "",
          }
          : undefined,
      }}
      authentication={{
        signIn: () => router.push("/account/sign-in"),
        signOut: async () => {
          await handleSignOut();
        },
      }}
    >
      <DashboardLayout>
        <PageContainer>{children}</PageContainer>
      </DashboardLayout>
    </NextAppProvider>
  );
}
