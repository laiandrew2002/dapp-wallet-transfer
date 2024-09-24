import localFont from "next/font/local";
import { useState } from "react";
import WalletConnection from "../components/WalletConnection";
import BalanceDisplay from "../components/BalanceDisplay";
import TransactionHistory from "../components/TransferHistory";
import TopBar from "../components/TopBar";

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
    <>
      <TopBar>
        <WalletConnection address={address} setAddress={setAddress}/>
      </TopBar>
      <div
        className={`${geistSans.variable} ${geistMono.variable} justify-items-center p-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]`}
      >
        <div>
          <BalanceDisplay address={address} />
          <TransactionHistory address={address} />
        </div>
      </div>
    </>
  );
}
