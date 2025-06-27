import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chemnitz explorer",
  description: "Discover, search, and save amazing places in Chemnitz with Chemnitz explorer!",
  openGraph: {
    title: "Chemnitz explorer",
    description: "Discover, search, and save amazing places in Chemnitz with Chemnitz explorer!",
    type: "website",
    url: "https://chemnitz-explorer.vercel.app/", // Update to your actual deployed URL
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Chemnitz explorer website preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chemnitz explorer",
    description: "Discover, search, and save amazing places in Chemnitz with Chemnitz explorer!",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
