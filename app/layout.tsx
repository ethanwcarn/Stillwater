import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers";
import { GlobalNav } from "@/components/global-nav"; // Import the new nav
import { BottomNav } from "@/components/bottom-nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Stillwaters — Faith-Integrated Mental Health",
  description: "Connect with faith-aware mental health support and community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans min-h-screen antialiased`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1019V80TQ7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {" "}
          {`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-1019V80TQ7'); `}
        </Script>
        <AuthProvider>
          <div className="hidden md:block">
            <GlobalNav />
          </div>

          <main className="pb-20">{children}</main>

          <div className="md:hidden">
            <BottomNav />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
