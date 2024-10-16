"use client";

import { useState } from "react";
import WalletConnection from "../components/WalletConnection";
import BalanceDisplay from "../components/BalanceDisplay";
import TransactionHistory from "../components/TransferHistory";
import TopBar from "../components/TopBar";

export default function Home() {
  const [address, setAddress] = useState<string | null>(null);
  return (
    <>
      <TopBar>
        <WalletConnection address={address} setAddress={setAddress} />
      </TopBar>
      <div className="justify-items-center p-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
        <div>
          <BalanceDisplay address={address} />
          <TransactionHistory address={address} />
        </div>
      </div>
    </>
  );
}