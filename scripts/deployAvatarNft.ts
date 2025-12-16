import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http, Hex, publicActions, getContract } from "viem";
import { sepolia } from "viem/chains";
import dotenv from "dotenv";
import avatarNftJson from '../artifacts/AvatarNft.json';

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY ;
const account = privateKeyToAccount(PRIVATE_KEY as Hex);

const {abi: avatarNftAbi, bytecode: avatarNftBytecode} = avatarNftJson;     

const client = createWalletClient({
    account,
    chain: sepolia,
    transport: http(process.env.SEPOLIA_RPC_URL)
}).extend(publicActions);

const txnHash = await client.deployContract({
    abi: avatarNftAbi,
    bytecode: avatarNftBytecode as Hex,
    args: [account.address]
});

console.log("Deployment transaction hash:", txnHash);

const txnReceipt = await client.waitForTransactionReceipt({ hash: txnHash });

console.log("Contract deployed at address:", txnReceipt.contractAddress); 
if(!txnReceipt.contractAddress) {
   console.error("Contract deployment failed.");
   process.exit(1);
} 

const avatarNftContract = await getContract({
        address: txnReceipt.contractAddress,
        abi: avatarNftAbi,
        client
    });

export default avatarNftContract;

