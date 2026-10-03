import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Motion | Advertiser workspace",
  description: "Advertiser and delivery partner workspaces for mobile outdoor advertising in Pune.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
