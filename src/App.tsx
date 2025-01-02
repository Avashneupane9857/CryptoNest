import { Route, Routes } from "react-router-dom";
import BlockchainSelector from "./components/BlockchainSelector";
import SolanaWallet from "./components/SolanaWallet";
import EthWallet from "./components/EthWallet";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<BlockchainSelector />} />
        <Route path="/solana" element={<SolanaWallet />} />
        <Route path="/eth" element={<EthWallet />} />
      </Routes>
    </div>
  );
}

export default App;
