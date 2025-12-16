'use client';

import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { 
  type BaseError,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi";
import { isAddress } from "viem";
import AvatarNft from "../../../deployments/AvatarNft.sepolia.json";



export default function Home() {
  //const [ethValue, setEthValue] = useState<number>();
  const [tokenURI, setTokenURI] = useState<string>(""); 
  const [mintRecipientAddress, setMintRecipientAddress] = useState<string>("");
  // const {data: txnHash, error, isPending: isSending, sendTransaction} = useSendTransaction();
  
  const { data: writeTxnHash, error: writeError, isPending: isWritePending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed} = useWaitForTransactionReceipt({
    hash: writeTxnHash
  });

  useEffect(() => {
    if (isConfirmed) {
      setTokenURI("");
      setMintRecipientAddress("");
    }
}, [isConfirmed]);

  
  const handleOnMint = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const tokenURI = formData.get("tokenURI") as string;
    const recipientAddress = formData.get("mintRecipientAddress") as string;
    writeContract({
      address: AvatarNft.address as `0x${string}`,
      abi: AvatarNft.abi,
      functionName: "safeMint",
      args: [recipientAddress, tokenURI],
    })
    

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

      <form onSubmit={handleOnMint} className=" bg-opacity-70 p-6 rounded-lg shadow-lg w-96">
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="ethValue">
            Token URI:
          </label>
          <input
            type="text"
            id="tokenURI"
            name="tokenURI"
            value={tokenURI}
            onChange={(e) => setTokenURI(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter Token URI"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="recipientAddress">
            Recipient Address:
          </label>
          <input
            type="text"
            id="mintRecipientAddress"
            name="mintRecipientAddress"
            value={mintRecipientAddress}
            onChange={(e) => {
              isAddress(e.target.value) && setMintRecipientAddress(e.target.value)
            } }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter recipient address"
          />
        </div>
        <button
          type="submit"
          disabled={isWritePending}
          className="bg-white text-indigo-600 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-gray-200 hover:cursor-pointer mb-4"
        >
          {isWritePending ? "Minting..." : "Mint NFT"}
        </button>
        {writeTxnHash && <div>Transaction Hash: {writeTxnHash}</div>}
        {isConfirming && <div>Transaction is being confirmed...</div>}
        {isConfirmed && <div>Transaction Confirmed!</div>}
        {writeError && (
          <div> Error: {(writeError as BaseError).shortMessage || writeError.message}</div>
        )}
      </form>
    </main>
  );
}
