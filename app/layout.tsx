import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "FarmSetu",
  title: {
    default: "FarmSetu",
    template: "%s | FarmSetu",
  },
  description:
    "A direct farm-to-consumer agriculture marketplace without middlemen.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  keywords: [
    "FarmSetu",
    "farm marketplace",
    "fresh produce",
    "direct farm commerce",
    "agriculture marketplace",
  ],
  authors: [{ name: "FarmSetu" }],
  creator: "FarmSetu",
  publisher: "FarmSetu",
  openGraph: {
    type: "website",
    siteName: "FarmSetu",
    title: "FarmSetu",
    description:
      "A direct farm-to-consumer agriculture marketplace without middlemen.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "FarmSetu",
    description:
      "A direct farm-to-consumer agriculture marketplace without middlemen.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background min-h-screen font-sans antialiased`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
