import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ScrollReveal from "@/components/ScrollReveal";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ScrollReveal />
        {children}
      </body>
    </html>
  );
}
