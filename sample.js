const { PublicKey, Connection, Keypair, LAMPORTS_PER_SOL } = require("@solana/web3.js");

const { PumpFunSDK } = require("./index");
const { AnchorProvider } = require("@coral-xyz/anchor");
const bs58 = require("bs58");

var walletSecret = "YOUR_WALLETS_PRIVATE_KEY_HERE";

const wallet = Keypair.fromSecretKey(new Uint8Array(bs58.decode(walletSecret)));

const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });

const sdk = new PumpFunSDK(provider);

var mintPublicKey = "369ZFSABpnXHkWLzgZ3Yazv12BRPoAo1MUEgZ8kJpump";
var mint = new PublicKey(mintPublicKey);

var init = async () => {
  const SLIPPAGE_BASIS_POINTS = 500n;

  var buyAmountSol = BigInt(0.0001 * LAMPORTS_PER_SOL);

  let bondingCurveAccount = await sdk.getBondingCurveAccount(mint, "confirmed");
  let buyAmount = bondingCurveAccount?.getBuyPrice(buyAmountSol);

  console.log("Buy Amount of Token: ", buyAmount);

  var buyResults = await sdk.buy(
    wallet,
    mint,
    buyAmountSol,
    SLIPPAGE_BASIS_POINTS,
    {
      unitLimit: 100000,
      unitPrice: 0.001 * LAMPORTS_PER_SOL,
      //autoCalculate: true,
      //fee: 0.0001
    },
    "confirmed",
    "confirmed",
  );

  console.log(buyResults);
};

init();
