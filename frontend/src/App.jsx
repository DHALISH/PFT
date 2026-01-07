import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from "./Signin.jsx";
import Signup from "./Signup.jsx";
import Index from "./Index.jsx";
import Dashboard from "./Dashboard.jsx";
import Category_list from "./category_list.jsx";
import Transactions from "./Transaction.jsx";
import Transactions_history from "./Transactions_history.jsx";
import Budget from "./Budget.jsx";
import Budget_list from "./Budget_list.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/category_list" element={<Category_list />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/transactions_history" element={<Transactions_history />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/budget_list" element={<Budget_list />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
