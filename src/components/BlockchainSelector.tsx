import { CurlyBracesIcon, SunIcon, MoonIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GenerateMnemonic from "./GenerateMnemonic";

const BlockchainSelector = () => {
  const [isDark, setIsDark] = useState(true);
  const [hasMnemonic, setHasMnemonic] = useState(false);
  const [showBlockchains, setShowBlockchains] = useState(false);
  const navigate = useNavigate();
  const [mnemonic, setMnemonic] = useState("");
  const handleSolana = () => {
    navigate("/solana", { state: { mnemonic } });
  };

  const handleEth = () => {
    navigate("/eth", { state: { mnemonic } });
  };

  const handleProceed = () => {
    if (hasMnemonic) {
      setShowBlockchains(true);
    }
  };

  const handleMnemonicGenerated = (generated: boolean, phrase: string) => {
    setHasMnemonic(generated);
    setMnemonic(phrase);
  };
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
          <span className="bg-purple-500 text-xs text-white px-2 py-1 rounded-full">
            OneShot
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
      <div className="max-w-3xl mx-auto text-center">
        <h1
          className={`text-5xl font-bold mb-6 ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          Explore Multiple Blockchains
        </h1>
        <p
          className={`text-xl mb-12 ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {showBlockchains
            ? "Select your preferred blockchain network to begin your journey"
            : "Generate your seed phrase to continue"}
        </p>

        {!showBlockchains && (
          <div className="space-y-6">
            <GenerateMnemonic onMnemonicGenerated={handleMnemonicGenerated} />
            <button
              onClick={handleProceed}
              disabled={!hasMnemonic}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                hasMnemonic
                  ? isDark
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-purple-500 hover:bg-purple-600 text-white"
                  : "bg-gray-400 cursor-not-allowed text-gray-200"
              }`}
            >
              Proceed to Wallet Selection
            </button>
          </div>
        )}

        {showBlockchains && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
            <button
              onClick={handleSolana}
              className={`group relative overflow-hidden rounded-xl ${
                isDark
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-black/10 hover:bg-black/20"
              } p-4 transition-all duration-300`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity" />
              <div className="relative flex flex-col items-center space-y-3">
                <img
                  src="https://www.chainalysis.com/wp-content/uploads/2022/08/shutterstock-2176242673-scaled-1-1500x970.jpg"
                  alt="Solana logo"
                  className="w-12 h-12 rounded-full"
                />
                <span
                  className={`font-semibold ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  Solana Wallet
                </span>
                <span
                  className={`text-xs ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Fast & Scalable
                </span>
              </div>
            </button>
            <button
              onClick={handleEth}
              className={`group relative overflow-hidden rounded-xl ${
                isDark
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-black/10 hover:bg-black/20"
              } p-4 transition-all duration-300`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity" />
              <div className="relative flex flex-col items-center space-y-3">
                <img
                  src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
                  alt="Ethereum logo"
                  className="w-12 h-12 rounded-full"
                />
                <span
                  className={`font-semibold ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  Ethereum Wallet
                </span>
                <span
                  className={`text-xs ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Secure & Established
                </span>
              </div>
            </button>
          </div>
        )}
      </div>
      <footer
        className={`fixed bottom-0 left-0 right-0 p-4 text-center text-sm ${
          isDark ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Developed with ❤️ by Avsh
      </footer>
    </div>
  );
};

export default BlockchainSelector;
