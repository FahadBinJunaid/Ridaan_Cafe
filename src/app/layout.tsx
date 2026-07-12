import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteHeader from "@/components/shared/site-header";
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
  title: {
    default: "Rindaan Cafe & Cuisine — Authentic Pakistani Dhaba",
    template: "%s | Rindaan Cafe & Cuisine",
  },
  description:
    "Order authentic Pakistani Dhaba-style food from Rindaan Cafe & Cuisine in Karachi, Sindh. Freshly prepared, Cash on Delivery.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Rindaan Cafe & Cuisine — Authentic Pakistani Dhaba",
    description:
      "Order authentic Pakistani Dhaba-style food from Rindaan Cafe & Cuisine in Karachi, Sindh. Freshly prepared, Cash on Delivery.",
    type: "website",
    locale: "en_PK",
    siteName: "Rindaan Cafe & Cuisine",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
