import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providors } from "@/components/providors";
import Header from "@/components/Header";

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
      <body className={inter.className} data-color-mode="light">
        <Providors>
          <Header />
          <main className="bg-slate-100 py-10 px-5">{children}</main>
        </Providors>
      </body>
    </html>
  );
}
