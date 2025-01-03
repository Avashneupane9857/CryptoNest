import { useState, useEffect, SetStateAction } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import {
  Keypair,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import nacl from "tweetnacl";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PlusCircleIcon,
  WalletIcon,
  CopyIcon,
  SunIcon,
  MoonIcon,
  CurlyBracesIcon,
  Trash2Icon,
  RefreshCwIcon,
} from "lucide-react";
interface SolanaLocationState {
  mnemonic: string;
}
interface WalletBalances {
  [key: string]: string;
}

interface WalletLoadingState {
  [key: string]: boolean;
}
export function SolanaWallet() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [publicKeys, setPublicKeys] = useState<PublicKey[]>([]);
  const [balances, setBalances] = useState<WalletBalances>({});
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<number | null>(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState<WalletLoadingState>(
    {}
  );

  const location = useLocation();
  const { mnemonic } = (location.state as SolanaLocationState) || {
    mnemonic: "",
  };

  const connection = new Connection("https://api.devnet.solana.com");

  const generateWallet = async () => {
    try {
      const seed = await mnemonicToSeed(mnemonic);
      const path = `m/44'/501'/${currentIndex}'/0'`;
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      const keypair = Keypair.fromSecretKey(secret);
      const newPublicKey = keypair.publicKey;

      setCurrentIndex(currentIndex + 1);
      setPublicKeys([...publicKeys, newPublicKey]);

      fetchBalance(newPublicKey);
    } catch (error) {
      console.error("Failed to generate wallet:", error);
    }
  };

  const fetchBalance = async (publicKey: PublicKey) => {
    const keyString = publicKey.toBase58();
    setIsBalanceLoading((prev) => ({ ...prev, [keyString]: true }));

    try {
      const balance = await connection.getBalance(publicKey);
      const balanceInSOL = balance / LAMPORTS_PER_SOL;
      setBalances((prev) => ({
        ...prev,
        [keyString]: balanceInSOL.toFixed(4),
      }));
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      setBalances((prev) => ({
        ...prev,
        [keyString]: "Error",
      }));
    } finally {
      setIsBalanceLoading((prev) => ({ ...prev, [keyString]: false }));
    }
  };

  // Refresh balances
  const refreshAllBalances = async () => {
    publicKeys.forEach((publicKey) => fetchBalance(publicKey));
  };

  // Auto refresh balances every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshAllBalances, 30000);
    return () => clearInterval(interval);
  }, [publicKeys]);

  const copyToClipboard = async (
    publicKey: string,
    index: SetStateAction<number | null>
  ) => {
    try {
      await navigator.clipboard.writeText(publicKey);
      setIsCopied(index);
      setTimeout(() => setIsCopied(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const deleteWallet = (indexToDelete: number) => {
    const deletedPublicKey = publicKeys[indexToDelete]?.toBase58();
    if (!deletedPublicKey) return;

    setPublicKeys(publicKeys.filter((_, index) => index !== indexToDelete));
    setBalances((prev) => {
      const newBalances = { ...prev };
      delete newBalances[deletedPublicKey];
      return newBalances;
    });
  };
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className={`min-h-screen p-8 ${isDark ? "bg-black" : "bg-white"}`}>
      <nav className="flex justify-between items-center mb-16">
        <div
          onClick={handleClick}
          className="flex items-center cursor-pointer space-x-2"
        >
          <CurlyBracesIcon
            className={`h-8 w-8 ${isDark ? "text-white" : "text-black"}`}
          />
          <span
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            CryptoNest
          </span>
          <span className="bg-purple-500 text-xs text-white px-2 py-1 rounded-full">
            Solana
          </span>
        </div>
        <button
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          onClick={() => setIsDark(!isDark)}
        >
          {isDark ? (
            <SunIcon className="h-5 w-5 text-white" />
          ) : (
            <MoonIcon className="h-5 w-5 text-black" />
          )}
        </button>
      </nav>

      <div className="max-w-3xl mx-auto">
        <h1
          className={`text-4xl font-bold mb-6 text-center ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          Your Solana Wallets
        </h1>
        <p
          className={`text-xl mb-12 text-center ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Generate and manage your Solana wallet addresses
        </p>

        <div className="mb-8">
          <button
            onClick={generateWallet}
            className="w-full flex items-center justify-center space-x-2 p-4 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors"
          >
            <PlusCircleIcon className="h-5 w-5" />
            <span>Generate New Wallet</span>
          </button>
        </div>

        <div className="space-y-4">
          {publicKeys.map((publicKey, index) => (
            <div
              key={publicKey.toBase58()}
              className={`p-4 rounded-xl ${
                isDark ? "bg-white/10" : "bg-black/5"
              } transition-colors group`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <WalletIcon
                    className={`h-6 w-6 ${
                      isDark ? "text-purple-400" : "text-purple-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Wallet {index + 1}
                    </p>
                    <p
                      className={`text-xs font-mono ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {publicKey.toBase58()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(publicKey.toBase58(), index)}
                    className={`p-2 rounded-md ${
                      isDark ? "hover:bg-white/10" : "hover:bg-black/10"
                    } transition-colors`}
                    title="Copy address"
                  >
                    <CopyIcon
                      className={`h-4 w-4 ${
                        isCopied === index
                          ? "text-green-500"
                          : isDark
                          ? "text-white"
                          : "text-black"
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => deleteWallet(index)}
                    className={`p-2 rounded-md opacity-0 group-hover:opacity-100 ${
                      isDark ? "hover:bg-red-500/20" : "hover:bg-red-500/10"
                    } transition-all duration-200`}
                    title="Delete wallet"
                  >
                    <Trash2Icon
                      className={`h-4 w-4 ${
                        isDark ? "text-red-400" : "text-red-500"
                      }`}
                    />
                  </button>
                </div>
              </div>
              <div className="text-white">
                <h1 className="font-bold text-2xl text-center p-7">
                  Wallet {index + 1}
                </h1>
                <div className="flex gap-6 items-center">
                  <h1 className="text-xl">Balance:</h1>
                  {isBalanceLoading[publicKey.toBase58()] ? (
                    <span className="text-xl">Loading...</span>
                  ) : (
                    <h1 className="text-xl">
                      {balances[publicKey.toBase58()] || "0"} SOL
                    </h1>
                  )}
                  <button
                    onClick={() => fetchBalance(publicKey)}
                    className="ml-2 p-2 rounded-md hover:bg-purple-500/20 transition-colors"
                    title="Refresh balance"
                  >
                    <RefreshCwIcon className="h-4 w-4 text-purple-400" />
                  </button>
                </div>
                <button className="bg-purple-600 rounded-xl px-3 mt-10 text-nowrap">
                  Send
                </button>
              </div>
            </div>
          ))}
        </div>

        {publicKeys.length === 0 && (
          <div
            className={`text-center p-8 rounded-xl ${
              isDark ? "bg-white/5" : "bg-black/5"
            }`}
          >
            <p
              className={`text-lg ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No wallets generated yet. Click the button above to create your
              first wallet.
            </p>
          </div>
        )}
      </div>

      <footer
        className={`fixed bottom-0 left-0 right-0 p-4 text-center text-sm ${
          isDark ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Developed with ❤️ by Mugi
      </footer>
    </div>
  );
}
