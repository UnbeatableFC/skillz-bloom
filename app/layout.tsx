import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/general/theme-provider";
import OnboardingGatekeeper from "@/components/general/onboarding-gatekeeper";

const inter = Inter({
   variable: '--font-inter',
  subsets: ['latin'],
  // Optional: specify weights or styles
  weight: ['400', '700']
});



export const metadata: Metadata = {
  title: "SkillzBloom",
  description: "Unlock Your Potential",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} antialiased`}
        >
          <OnboardingGatekeeper>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster richColors />
            </ThemeProvider>
          </OnboardingGatekeeper>
        </body>
      </html>
    </ClerkProvider>
  );
}
