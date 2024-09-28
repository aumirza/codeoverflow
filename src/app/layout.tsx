import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providors } from "@/components/providors";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Codeoverflow",
  description: "Solution to all your coding problems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providors>
          <Header />
          <main className="flex justify-center bg-slate-100 py-10">
            {children}
          </main>
        </Providors>
      </body>
    </html>
  );
}
