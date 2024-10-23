import type { Metadata } from "next";
import "@/app/globals.css";
import Navbar from "@/components/navbar/Navbar";
import Providers from "@/app/providers";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Airbnc",
  description:
    "From cozy cottages to elegant penthouses, Hosts are happy to share their places. Whether its a work trip, weekend getaway, family vacation, or a longer stay, there are millions of amazing places to visit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={``}>
          <Providers>
            <Navbar />
            <main className="container py-10">{children}</main>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
