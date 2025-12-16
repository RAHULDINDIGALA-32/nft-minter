'use client';

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  const [ethValue, setEthValue] = useState<number>(0);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEthValue(parseFloat(e.target.value));
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-300 flex flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-bold">
        Welcome to the NFT Minter!
      </h1>

      <ConnectButton
        label="Connect Wallet"
        showBalance={true}
        accountStatus="address"
        chainStatus="full"
      />
    </main>
  );
}
