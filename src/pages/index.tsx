import localFont from "next/font/local";
import WalletConnection from "../components/WalletConnection";
import BalanceDisplay from "../components/BalanceDisplay";
import TransferForm from "../components/TransferForm";
import TransactionHistory from "../components/TransferHistory";
import { useState } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const [address, setAddress] = useState<string | null>(null);
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <div>
        <h1>Scroll Simple Transfer DApp</h1>
        <WalletConnection address={address} setAddress={setAddress} />
        <BalanceDisplay address={address} />
        <TransferForm address={address} />
        <TransactionHistory address={address} />
      </div>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
