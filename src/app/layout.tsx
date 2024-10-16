import "./globals.css";
import { ReactNode } from "react";
import Head from 'next/head';
import UiProvider from "../providers/UiProvider";
import localFont from "next/font/local";

// Set up the fonts
const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Wallet Transfer",
  description: "Transfer ETH using Wallet Transfer",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <UiProvider>{children}</UiProvider>
      </body>
    </html>
  );
}
