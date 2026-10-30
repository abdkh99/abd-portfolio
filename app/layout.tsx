import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
// @ts-expect-error CSS side-effect imports are handled by Next.js.
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import IntroPreloader from "@/components/IntroPreloader";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-display",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Abdullah | Portfolio ",
  description: "Your professional portfolio website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={bricolage.variable} suppressHydrationWarning>
      <head>
        {/* Returning visitors in the same session: hide the intro before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("intro-seen")==="1")document.documentElement.dataset.intro="seen"}catch(e){}`,
          }}
        />
        <link rel="icon" href="/boy.png" type="image/png" />
      </head>
      <body>
        <IntroPreloader initials="A" tagline="Crafting Digital Experiences" />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
