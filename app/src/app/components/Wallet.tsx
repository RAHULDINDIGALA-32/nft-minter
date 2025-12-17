import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Wallet() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
      <h2 className="text-3xl font-bold">Connect Wallet</h2>
      <p className="text-gray-400">
        Connect your wallet to mint a Cyberpunk Avatar
      </p>
      <ConnectButton />
    </div>
  );
}
