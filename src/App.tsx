import { Route, Routes } from "react-router-dom";
import BlockchainSelector from "./components/BlockchainSelector";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<BlockchainSelector />} />
      </Routes>
    </div>
  );
}

export default App;
