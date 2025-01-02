import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";
import { useLocation } from "react-router-dom";
import {
  PlusCircleIcon,
  WalletIcon,
  CopyIcon,
  SunIcon,
  MoonIcon,
  CurlyBracesIcon,
} from "lucide-react";

export const EthWallet = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [isDark, setIsDark] = useState(true);
  const [isCopied, setIsCopied] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { mnemonic } = location.state;

  const generateWallet = async () => {
    setIsLoading(true);
    try {
      const seed = await mnemonicToSeed(mnemonic);
      const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
      const hdNode = HDNodeWallet.fromSeed(seed);
      const child = hdNode.derivePath(derivationPath);
      const privateKey = child.privateKey;
      const wallet = new Wallet(privateKey);
      setCurrentIndex(currentIndex + 1);
      setAddresses([...addresses, wallet.address]);
    } catch (error) {
      console.error("Failed to generate wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (address: string, index: number) => {
    try {
      await navigator.clipboard.writeText(address);
      setIsCopied(index);
      setTimeout(() => setIsCopied(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className={`min-h-screen p-8 ${isDark ? "bg-black" : "bg-white"}`}>
      <nav className="flex justify-between items-center mb-16">
        <div className="flex items-center space-x-2">
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
          <span className="bg-blue-500 text-xs text-white px-2 py-1 rounded-full">
            Ethereum
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
          Your Ethereum Wallets
        </h1>
        <p
          className={`text-xl mb-12 text-center ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Generate and manage your Ethereum wallet addresses
        </p>

        <div className="mb-8">
          <button
            onClick={generateWallet}
            disabled={isLoading}
            className={`w-full flex items-center justify-center space-x-2 p-4 rounded-lg 
              ${
                isLoading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } 
              text-white font-medium transition-colors`}
          >
            <PlusCircleIcon className="h-5 w-5" />
            <span>{isLoading ? "Generating..." : "Generate New Wallet"}</span>
          </button>
        </div>

        <div className="space-y-4">
          {addresses.map((address, index) => (
            <div
              key={address}
              className={`p-4 rounded-xl ${
                isDark ? "bg-white/10" : "bg-black/5"
              } transition-colors`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <WalletIcon
                    className={`h-6 w-6 ${
                      isDark ? "text-blue-400" : "text-blue-600"
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
                      {address}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(address, index)}
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
              </div>
            </div>
          ))}
        </div>

        {addresses.length === 0 && (
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
};
