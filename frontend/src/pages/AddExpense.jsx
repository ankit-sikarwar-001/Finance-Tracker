import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


export default function AddExpense() {
    const [form, setForm] = useState({
        merchant: "",
        amount: "",
        category: "",
        date: "",
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (form.merchant == "") throw "name not found ";
            if (form.amount == "") throw "amount can't  be empty";
            if (form.category == "") throw "category is required ";
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/manual`, form);
            toast.success("Expense Added!");
            navigate("/");
        } catch (err) {
            toast.error(err);
            console.log(err);
        }
    };

    return (
        <div className="max-h-full flex justify-center items-center w-full">
            <div>
                <h2 className="text-2xl font-bold mb-4">Add Expense Manually</h2>

                <form className="space-y-4 w-80" onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Merchant"
                        className="border p-2 w-full"
                        onChange={(e) => setForm({ ...form, merchant: e.target.value })}
                    />

                    <input
                        type="number"
                        placeholder="Amount"
                        className="border p-2 w-full"
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    />

                    <input
                        type="text"
                        placeholder="Category"
                        className="border p-2 w-full"
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                    />

                    <input
                        type="date"
                        className="border p-2 w-full"
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />

                    <button className="bg-blue-600 text-white p-2 rounded w-full cursor-pointer">
                        Add Expense
                    </button>
                </form>
            </div>
        </div>

    );
}
