import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Empathica",
  description: "Where AI Meets Human Understanding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
