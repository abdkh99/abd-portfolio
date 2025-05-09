import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Abdullah | Portfolio :)",
  description: "Your professional portfolio website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/boy.png" type="image/png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
