import axios from "axios";
import { useEffect, useState } from "react";

export default function RecentActivity() {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/expenses")
            .then(res => setExpenses(res.data));
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>

            <div className="space-y-4">
                {expenses.map(e => (
                    <div key={e._id} className="p-4 bg-gray-100 rounded shadow">
                        <div className="font-semibold">{e.merchant}</div>
                        <div>₹{e.amount}</div>
                        <div className="text-sm text-gray-600">{e.category}</div>
                        <div className="text-sm">{e.date}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
