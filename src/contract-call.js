import {
  makeContractCall,
  broadcastTransaction,
  contractPrincipalCV,
  createFungiblePostCondition,
  bufferCVFromString,
  createAssetInfo,
  FungibleConditionCode,
} from "@stacks/transactions";
import { StacksTestnet } from "@stacks/network";

function stringToHex(str) {
  return "0x" + Buffer.from(str).toString("hex");
}

const network = new StacksTestnet();

// Replace these with your own account and key
//   You can get STXLINK here: http://100.26.22.43/
const senderAddress = "STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6";
const senderKey =
  "cb3df38053d132895220b9ce471f6b676db5b9bf0b4adefb55f2118ece2478df01";

// Replace these with your own consumer contract info
const consumerContractAddress = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const consumerContractName = "direct-request";
const consumerContractFunction = "create-request";

const jobSpecID = "fcb09f2fc3fb40ec990cc1a826d51a3e";

// Replace with whatever API you want to call and path from the returned JSON
const requestParams = {
  get: "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD",
  path: "USD",
};

// Replace this with the options required for your contract.
const txOptions = {
  contractAddress: consumerContractAddress,
  contractName: consumerContractName,
  functionName: consumerContractFunction,
  functionArgs: [
    bufferCVFromString(stringToHex(jobSpecID)),
    bufferCVFromString(stringToHex(senderAddress)),
    bufferCVFromString(stringToHex(JSON.stringify(requestParams))),
    contractPrincipalCV("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM", "oracle"),
    contractPrincipalCV(consumerContractAddress, consumerContractName),
    contractPrincipalCV(consumerContractAddress, consumerContractName),
  ],
  senderKey: senderKey,
  validateWithAbi: true,
  network,
  fee: 100000,
  postConditions: [
    createFungiblePostCondition(
      senderAddress,
      FungibleConditionCode.Equal,
      1,
      createAssetInfo(
        "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
        "stxlink-token",
        "stxlink-token"
      )
    ),
  ],
  anchorMode: 1,
};

const transaction = await makeContractCall(txOptions);
const broadcastResponse = await broadcastTransaction(transaction, network);

// You can check the call status on https://explorer.stacks.co/?chain=testnet
console.log("txid:", broadcastResponse.txid);
