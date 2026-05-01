import LoginPanel from "./components/Login/Login.jsx"
import Register from "./components/Register/Register.jsx"
import { Routes, Route } from "react-router-dom";
import Dealers from "./components/Dealers/Dealers.jsx"
import Dealer from "./components/Dealers/Dealer.jsx"
import Postreview from "./components/Dealers/PostReview.jsx"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPanel />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dealers" element={<Dealers />} />
      <Route path="/dealer/:id" element={<Dealer />} />
      <Route path="/postreview/:id" element={<Postreview />} />
    </Routes>
  );
}
export default App;
