import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

import Dashboard from "./pages/Dashboard";
import RecentActivity from "./pages/RecentActivity";
import Bills from "./pages/Bills";
import UploadReceipt from "./pages/UploadReciept";
import AddExpense from "./pages/AddExpense";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster position="top-center" />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/recent" element={<RecentActivity />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/upload" element={<UploadReceipt />} />
          <Route path="/add-expense" element={<AddExpense />} />
        </Routes>
      </div>

    </BrowserRouter>
  );
}
