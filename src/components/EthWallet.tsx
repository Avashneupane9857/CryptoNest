import { useState, useEffect } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet, JsonRpcProvider, parseEther } from "ethers";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PlusCircleIcon,
  WalletIcon,
  CopyIcon,
  SunIcon,
  MoonIcon,
  CurlyBracesIcon,
  SendIcon,
  XIcon,
} from "lucide-react";
interface WalletBalances {
  [key: string]: string;
}

interface WalletLoadingState {
  [key: string]: boolean;
}
interface TransactionData {
  to: string;
  amount: string;
}

interface WalletState {
  [key: string]: Wallet;
}

interface LocationState {
  mnemonic: string;
}

export const EthWallet = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [addresses, setAddresses] = useState<string[]>([]);
  const [balances, setBalances] = useState<WalletBalances>({});
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBalanceLoading, setIsBalanceLoading] = useState<WalletLoadingState>(
    {}
  );
  const [showSendModal, setShowSendModal] = useState<boolean>(false);
  const [selectedWalletIndex, setSelectedWalletIndex] = useState<number | null>(
    null
  );
  const [transactionData, setTransactionData] = useState<TransactionData>({
    to: "",
    amount: "",
  });
  const [transactionStatus, setTransactionStatus] = useState<string>("");
  const [wallets, setWallets] = useState<WalletState>({});

  const location = useLocation();
  const { mnemonic } = (location.state as LocationState) || { mnemonic: "" };

  const provider = new JsonRpcProvider(
    "https://mainnet.infura.io/v3/4fcc938b3b9c4ca4b5f3bd498cba5015"
  );

  const generateWallet = async () => {
    setIsLoading(true);
    try {
      const seed = await mnemonicToSeed(mnemonic);
      const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
      const hdNode = HDNodeWallet.fromSeed(seed);
      const child = hdNode.derivePath(derivationPath);
      const privateKey = child.privateKey;
      const wallet = new Wallet(privateKey);
      const newAddress = wallet.address;

      setCurrentIndex(currentIndex + 1);
      setAddresses([...addresses, newAddress]);
      setWallets((prev) => ({ ...prev, [newAddress]: wallet }));

      fetchBalance(newAddress);
    } catch (error) {
      console.error("Failed to generate wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBalance = async (address: string) => {
    setIsBalanceLoading((prev) => ({ ...prev, [address]: true }));
    try {
      const balance = await provider.getBalance(address);
      const balanceInEth = Number(balance) / 1e18;
      setBalances((prev) => ({
        ...prev,
        [address]: balanceInEth.toFixed(4),
      }));
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      setBalances((prev) => ({
        ...prev,
        [address]: "Error",
      }));
    } finally {
      setIsBalanceLoading((prev) => ({ ...prev, [address]: false }));
    }
  };
  const sendTransaction = async () => {
    if (selectedWalletIndex === null) return;

    setTransactionStatus("Processing...");
    try {
      const wallet = wallets[addresses[selectedWalletIndex]]?.connect(provider);
      if (!wallet) throw new Error("Wallet not found");

      const tx = await wallet.sendTransaction({
        to: transactionData.to,
        value: parseEther(transactionData.amount),
      });

      setTransactionStatus("Waiting for confirmation...");
      await tx.wait();

      setTransactionStatus("Transaction successful!");
      fetchBalance(addresses[selectedWalletIndex]);

      setTimeout(() => {
        setShowSendModal(false);
        setTransactionStatus("");
        setTransactionData({ to: "", amount: "" });
      }, 2000);
    } catch (error) {
      console.error("Transaction failed:", error);
      setTransactionStatus(
        `Transaction failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
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

  useEffect(() => {
    const interval = setInterval(() => {
      addresses.forEach((address) => fetchBalance(address));
    }, 30000);

    return () => clearInterval(interval);
  }, [addresses]);

  const SendModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div
        className={`${
          isDark ? "bg-gray-800" : "bg-white"
        } rounded-xl p-6 max-w-md w-full`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            {/* Send ETH from Wallet {selectedWalletIndex + 1} */}
            Send ETH from Wallet
          </h3>
          <button
            onClick={() => {
              setShowSendModal(false);
              setTransactionStatus("");
              setTransactionData({ to: "", amount: "" });
            }}
            className={`p-1 rounded-full ${
              isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
          >
            <XIcon
              className={`h-5 w-5 ${isDark ? "text-white" : "text-black"}`}
            />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Recipient Address
            </label>
            <input
              type="text"
              value={transactionData.to}
              onChange={(e) =>
                setTransactionData((prev) => ({ ...prev, to: e.target.value }))
              }
              className="w-full p-2 rounded-md bg-gray-700 text-white"
              placeholder="0x..."
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Amount (ETH)
            </label>
            <input
              type="number"
              value={transactionData.amount}
              onChange={(e) =>
                setTransactionData((prev) => ({
                  ...prev,
                  amount: e.target.value,
                }))
              }
              className="w-full p-2 rounded-md bg-gray-700 text-white"
              placeholder="0.0"
              step="0.0001"
              min="0"
            />
          </div>

          {transactionStatus && (
            <div
              className={`text-sm ${
                transactionStatus.includes("failed")
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {transactionStatus}
            </div>
          )}

          <button
            onClick={sendTransaction}
            disabled={
              !transactionData.to ||
              !transactionData.amount ||
              transactionStatus.includes("Processing")
            }
            className={`w-full py-2 px-4 rounded-md ${
              !transactionData.to ||
              !transactionData.amount ||
              transactionStatus.includes("Processing")
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white font-medium transition-colors`}
          >
            {transactionStatus.includes("Processing")
              ? "Processing..."
              : "Send ETH"}
          </button>
        </div>
      </div>
    </div>
  );
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };
  return (
    <div className={`min-h-screen p-8 ${isDark ? "bg-black" : "bg-white"}`}>
      <nav className="flex justify-between items-center mb-16">
        <div
          onClick={handleClick}
          className="flex items-center space-x-2 cursor-pointer"
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
              <div className={`${isDark ? "text-white" : "text-black"}`}>
                <h1 className="font-bold text-2xl text-center p-7">
                  Wallet {index + 1}
                </h1>
                <div className="flex gap-6 items-center">
                  <h1 className="text-xl">Balance:</h1>
                  {isBalanceLoading[address] ? (
                    <span className="text-xl">Loading...</span>
                  ) : (
                    <h1 className="text-xl">{balances[address] || "0"} ETH</h1>
                  )}
                  <button
                    onClick={() => fetchBalance(address)}
                    className="ml-2 text-sm bg-blue-500 hover:bg-blue-600 rounded-md px-2 py-1 text-white"
                  >
                    Refresh
                  </button>
                </div>
                <button
                  onClick={() => {
                    setSelectedWalletIndex(index);
                    setShowSendModal(true);
                  }}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 rounded-xl px-4 py-2 mt-4 text-white transition-colors"
                >
                  <SendIcon className="h-4 w-4" />
                  <span>Send ETH</span>
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

      {showSendModal && <SendModal />}

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
