'use client';

import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  type BaseError,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import AvatarNft from '../../../deployments/AvatarNft.sepolia.json';
import NFTS from './nftsData';



export default function Home() {
  const [selectedNFT, setSelectedNFT] = useState<number | null>(null);

  const {
    data: txHash,
    error,
    isPending,
    writeContract,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isSuccess) {
      setSelectedNFT(null);
    }
  }, [isSuccess]);

  const handleMint = () => {
    if (selectedNFT === null) return;

    writeContract({
      address: AvatarNft.address as `0x${string}`,
      abi: AvatarNft.abi,
      functionName: 'safeMint',
      args: [
        // Mint to connected wallet
        undefined,
        NFTS[selectedNFT].tokenURI,
      ],
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-indigo-900 text-white p-8">
      <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <h1 className="text-4xl font-extrabold tracking-wide">
          Cyberpunk Web3 Avatars
        </h1>
        <ConnectButton />
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {NFTS.map((nft, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedNFT(idx)}
            className={`cursor-pointer rounded-2xl overflow-hidden shadow-xl border transition-all duration-300
              ${selectedNFT === idx
                ? 'border-pink-400 scale-105'
                : 'border-white/10 hover:scale-105'
              }`}
          >
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-4 bg-black/60 h-full">
              <h3 className="text-xl font-bold mb-1">{nft.name}</h3>
              <p className="text-sm text-gray-300">{nft.description}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-12 flex flex-col items-center gap-4">
        <button
          onClick={handleMint}
          disabled={selectedNFT === null || isPending}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-lg disabled:opacity-50 hover:disabled:cursor-not-allowed hover:cursor-pointer"
        >
          {isPending ? 'Minting...' : 'Mint Selected Avatar'}
        </button>

        {txHash && <p className="text-sm">Tx Hash: {txHash}</p>}
        {isConfirming && <p className="text-sm">Confirming transaction...</p>}
        {isSuccess && <p className="text-green-400">Mint Successful </p>}
        {error && (
          <p className="text-red-400 text-sm">
            {(error as BaseError).shortMessage || error.message}
          </p>
        )}
      </section>
    </main>
  );
}
