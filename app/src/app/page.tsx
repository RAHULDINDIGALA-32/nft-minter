'use client';

import { useState, useEffect } from 'react';
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  type BaseError,
} from 'wagmi';
import AvatarNft from '../../contractDeployments/AvatarNft.sepolia.json';
import NFTS from './data/nftsData';
import NFTCard from './components/NftCard';
import NFTModal from './components/NftModal';
import Wallet from './components/Wallet';
import { Toaster, toast } from 'react-hot-toast';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [selectedNFT, setSelectedNFT] = useState<any>(null);

  const { data: txHash, writeContract, isPending, error } =
    useWriteContract();

  const { isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('NFT Minted Successfully!');
      setSelectedNFT(null);
    }
    if (error) {
      toast.error((error as BaseError).shortMessage);
    }
  }, [isSuccess, error]);

  const handleMint = () => {
    writeContract({
      address: AvatarNft.address as `0x${string}`,
      abi: AvatarNft.abi,
      functionName: 'safeMint',
      args: [address, selectedNFT.tokenURI],
    });
  };

  if (!isConnected) return <Wallet/>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-indigo-900 text-white p-8">
      <Toaster position="bottom-right" />

      <h1 className="text-4xl font-extrabold mb-12">
        Cyberpunk Web3 Avatars
      </h1>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {NFTS.map((nft) => (
          <NFTCard
            key={nft.tokenId}
            nft={nft}
            address={address}
            onSelect={setSelectedNFT}
          />
        ))}
      </section>

      {selectedNFT && (
        <NFTModal
          nft={selectedNFT}
          onMint={handleMint}
          onClose={() => setSelectedNFT(null)}
          onCancel={() => setSelectedNFT(null)}
          isMinting={isPending}
        />
      )}

      {txHash && (
        <a
          href={`https://sepolia.etherscan.io/tx/${txHash}`}
          target="_blank"
          className="block text-center mt-6 text-blue-400 underline"
        >
          View on Etherscan
        </a>
      )}
    </main>
  );
}
