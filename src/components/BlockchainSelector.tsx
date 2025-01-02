import { CurlyBracesIcon, SunIcon, MoonIcon } from "lucide-react";
import { useState } from "react";

const BlockchainSelector = () => {
  const [isDark, setIsDark] = useState(true);

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
          <span className="bg-purple-500 text-xs text-white px-2 py-1 rounded-full">
            Mugi
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
          Select your preferred blockchain network to begin your journey
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
          <button
            className={`group relative overflow-hidden rounded-xl ${
              isDark
                ? "bg-white/10 hover:bg-white/20"
                : "bg-black/10 hover:bg-black/20"
            } p-4 transition-all duration-300`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity" />
            <div className="relative flex flex-col items-center space-y-3">
              <img
                src="https://forkast.news/wp-content/uploads/2021/12/FF_Solana.png"
                alt="Solana logo"
                className="w-12 h-12 rounded-full"
              />
              <span
                className={`font-semibold ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                Solana Network
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
            className={`group relative overflow-hidden rounded-xl ${
              isDark
                ? "bg-white/10 hover:bg-white/20"
                : "bg-black/10 hover:bg-black/20"
            } p-4 transition-all duration-300`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity" />
            <div className="relative flex flex-col items-center space-y-3">
              <img
                src="https://e7.pngegg.com/pngimages/89/859/png-clipart-ethereum-blockchain-cryptocurrency-bitcoin-logo-bitcoin-angle-triangle.png"
                alt="Ethereum logo"
                className="w-12 h-12 rounded-full"
              />
              <span
                className={`font-semibold ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                Ethereum Network
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
      </div>
      <footer
        className={`fixed bottom-0 left-0 right-0 p-4 text-center text-sm ${
          isDark ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Developed with ❤️ by Mugi's
      </footer>
    </div>
  );
};

export default BlockchainSelector;
