import Web3 from "web3";
import { Biconomy } from "@biconomy/mexa";

const biconomy = new Biconomy(window.ethereum, {
  apiKey: "P6WZYkE-4.d8f90e62-d5ee-47e7-a909-d2026de5e700",
  debug: true,
});
let web3;

web3 = new Web3(biconomy);
// if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
//   //in the browser and metamask running
//   web3 = new Web3(window.web3.currentProvider);
// } else {
//   const provider = new Web3.providers.HttpProvider(
//     process.env.REACT_APP_INFURA_URL
//   );
//   web3 = new Web3(provider);
// }

export default web3;
