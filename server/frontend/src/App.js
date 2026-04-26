import LoginPanel from "./components/Login/Login.jsx"
import Register from "./components/Register/Register.jsx"
import { Routes, Route } from "react-router-dom";
import Dealers from "./components/Dealers/Dealers.jsx"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPanel />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dealers" element={<Dealers />} />
      <Route path="*" element={null} />
    </Routes>
  );
}
export default App;
