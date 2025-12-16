'use client';

import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { 
  type BaseError,
  useSendTransaction,
  useWaitForTransactionReceipt
} from "wagmi";
import { parseEther } from "viem";

export default function Home() {
  const [ethValue, setEthValue] = useState<number>();
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const {data:hash, error, isPending, sendTransaction} = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed} = useWaitForTransactionReceipt({
    hash
  });

  useEffect(() => {
    if (isConfirmed) {
      setEthValue(0);
      setRecipientAddress("");
    }
}, [isConfirmed]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEthValue(parseFloat(e.target.value));
  }

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const to = formData.get("recipientAddress") as `0x${string}`;
    const value = formData.get("ethvalue") as string;
    console.log({ to, value });
    sendTransaction({
      to,
      value: parseEther(value)
    });

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

      <form onSubmit={handleOnSubmit} className=" bg-opacity-70 p-6 rounded-lg shadow-lg w-96">
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="ethValue">
            ETH Value:
          </label>
          <input
            type="number"
            id="ethValue"
            name="ethvalue"
            value={ethValue}
            min="0"
            step="1e-9"
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter ETH value"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="recipientAddress">
            Recipient Address:
          </label>
          <input
            type="text"
            id="recipientAddress"
            name="recipientAddress"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter recipient address"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-white text-indigo-600 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-gray-200 hover:cursor-pointer mb-4"
        >
          {isPending ? "Minting..." : "Mint NFT"}
        </button>
        {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Transaction is being confirmed...</div>}
        {isConfirmed && <div>Transaction Confirmed!</div>}
        {error && (
          <div> Error: {(error as BaseError).shortMessage || error.message}</div>
        )}
      </form>
    </main>
  );
}
