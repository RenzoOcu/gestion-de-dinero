import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Finanzas — Control de Gastos e Ingresos",
  description: "Sistema personal de gestión financiera",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="h-full bg-[#F7F7F5] text-[#111111] antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
