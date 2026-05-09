import type { Metadata } from "next";
import { Bebas_Neue, Raleway } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Trustabl — Make Your AI Tools Production-Ready",
  description:
    "Average Production Readiness Score goes from 38% to 91%. Automatically harden your AI tools with validation rules, retry safety, observability hooks, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${raleway.variable} ${bebasNeue.variable} h-full antialiased`} style={{ background: '#0C0C0E' }}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
