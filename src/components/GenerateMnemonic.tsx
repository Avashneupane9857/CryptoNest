import { generateMnemonic } from "bip39";
import { useState, useEffect } from "react";
import { KeyIcon, CopyIcon, RefreshCwIcon } from "lucide-react";

const GenerateMnemonic = ({ onMnemonicGenerated }) => {
  const [mnemonic, setMnemonic] = useState("");
  const [isDark] = useState(true);

  const generateNewMnemonic = async () => {
    const mn = await generateMnemonic();
    setMnemonic(mn);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mnemonic);
  };

  // Notify parent component whenever mnemonic changes
  useEffect(() => {
    onMnemonicGenerated(!!mnemonic);
  }, [mnemonic, onMnemonicGenerated]);

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`p-6 rounded-xl ${isDark ? "bg-white/10" : "bg-black/10"}`}
      >
        <div className="flex items-center space-x-2 mb-4">
          <KeyIcon
            className={`h-6 w-6 ${isDark ? "text-white" : "text-black"}`}
          />
          <h2
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            Generate Seed Phrase
          </h2>
        </div>
        <p
          className={`text-sm mb-4 ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          This will generate a secure, random 12-word mnemonic phrase that can
          be used as a seed for your wallet.
        </p>
        <div className="space-y-4">
          <button
            onClick={generateNewMnemonic}
            className="flex items-center justify-center space-x-2 w-full p-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors"
          >
            <RefreshCwIcon className="h-5 w-5" />
            <span>Generate New Phrase</span>
          </button>
          <div className="relative">
            <textarea
              value={mnemonic}
              readOnly
              rows={3}
              className={`w-full p-4 rounded-lg font-mono text-sm ${
                isDark
                  ? "bg-black/50 text-white border border-white/10"
                  : "bg-white/50 text-black border border-black/10"
              } focus:ring-2 focus:ring-purple-500 focus:outline-none`}
              placeholder="Your seed phrase will appear here..."
            />
            {mnemonic && (
              <button
                onClick={copyToClipboard}
                className={`absolute top-2 right-2 p-2 rounded-md ${
                  isDark ? "hover:bg-white/10" : "hover:bg-black/10"
                } transition-colors`}
                title="Copy to clipboard"
              >
                <CopyIcon
                  className={`h-4 w-4 ${isDark ? "text-white" : "text-black"}`}
                />
              </button>
            )}
          </div>
        </div>
        {mnemonic && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              isDark
                ? "bg-red-500/10 text-red-400"
                : "bg-red-500/10 text-red-600"
            }`}
          >
            <p className="text-sm">
              ⚠️ Never share your seed phrase with anyone. Store it safely
              offline.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateMnemonic;
