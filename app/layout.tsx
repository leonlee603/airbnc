import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Airbnc",
  description: "From cozy cottages to elegant penthouses, Hosts are happy to share their places. Whether its a work trip, weekend getaway, family vacation, or a longer stay, there are millions of amazing places to visit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={``}
      >
        {children}
      </body>
    </html>
  );
}
