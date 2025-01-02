import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface LocationState {
  mnemonic: string;
}

export const SolanaWallet = () => {
  const location = useLocation();
  const { mnemonic } = location.state as LocationState;

  useEffect(() => {
    // Now you can use the mnemonic to initialize the Solana wallet
    if (mnemonic) {
      // Initialize Solana wallet with the mnemonic
      console.log("Initializing Solana wallet with mnemonic:", mnemonic);
    }
  }, [mnemonic]);

  return (
    <div>
      {/* Your Solana wallet UI */}
      <p>Your Solana wallet has been initialized with your seed phrase</p>
    </div>
  );
};
