import axios from "axios";
import { useEffect, useState } from "react";
import {
    BarChart, Bar, PieChart, Pie, Cell,
    CartesianGrid, XAxis, YAxis, Tooltip, Legend
} from "recharts";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/expenses")
            .then(res => setExpenses(res.data));
    }, []);

    // Calculate Totals
    const categoryTotals = expenses.reduce((acc, cur) => {
        acc[cur.category] = (acc[cur.category] || 0) + cur.amount;
        return acc;
    }, {});

    const pieData = Object.keys(categoryTotals).map((k) => ({
        name: k,
        value: categoryTotals[k],
    }));

    const barData = pieData;

    // Daily Breakdown
    const daily = {};
    expenses.forEach((e) => {
        // Guard against missing/null dates
        if (!e || !e.date) return;
        const d = String(e.date).slice(0, 10);
        daily[d] = (daily[d] || 0) + (Number(e.amount) || 0);
    });

    // const dailyList = Object.keys(daily).map((d) => ({
    //     date: d,
    //     amount: daily[d],
    // }));
    console.log(expenses)

    return (
        <div className="space-y-10">

            {/* ---------- TOP SUMMARY ---------- */}
            <h2 className="text-3xl font-bold">Dashboard</h2>

            <div className="grid grid-cols-3 gap-6">

                {/* Total Spend */}
                <div className="bg-purple-600 text-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg">Total Spent</h3>
                    <p className="text-3xl font-bold mt-2">
                        ₹{expenses.reduce((a, b) => a + (Number(b?.amount) || 0), 0).toFixed(2)}
                    </p>
                </div>

                {/* Today */}
                <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg">Today's Spending</h3>
                    <p className="text-3xl font-bold mt-2">
                        ₹{daily[new Date().toISOString().slice(0, 10)] || 0}
                    </p>
                </div>

                {/* Total Bills */}
                <div className="bg-green-600 text-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg">Total Bills</h3>
                    <p className="text-3xl font-bold mt-2">{expenses.length}</p>
                </div>
            </div>




            {/* ---------- GRAPH SECTION ---------- */}
            <div className="grid grid-cols-2 gap-6">

                {/* Bar Chart */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-xl font-semibold mb-3">Category Expense Breakdown</h3>

                    <BarChart width={500} height={300} data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value">
                            {barData.map((_, i) => (
                                <Cell key={i} fill={`hsl(${i * 60}, 70%, 50%)`} />
                            ))}
                        </Bar>
                    </BarChart>
                </div>

                {/* Pie Chart */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-xl font-semibold mb-3">Expense Pie Chart</h3>

                    <PieChart width={400} height={300}>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            label
                            dataKey="value"
                        >
                            {pieData.map((_, i) => (
                                <Cell key={i} fill={`hsl(${i * 50}, 70%, 50%)`} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </div>
            </div>

            {/* ---------- RECENT ACTIVITY PREVIEW ---------- */}
            <div className="bg-white p-6 rounded-xl shadow">
                <div className="flex justify-between">
                    <h3 className="text-xl font-semibold">Recent Activity</h3>
                    <Link to="/recent" className="text-blue-600">View All →</Link>
                </div>

                <div className="mt-4 space-y-3">
                    {expenses.slice(0, 5).map(e => (
                        <div key={e._id} className="p-3 border rounded flex justify-between">
                            <span>{e.merchant}</span>
                            <span className="font-semibold">₹{e.amount}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ---------- RECENT BILLS PREVIEW ---------- */}
            <div className="bg-white p-6 rounded-xl shadow">
                <div className="flex justify-between">
                    <h3 className="text-xl font-semibold">Recent Bills</h3>
                    <Link to="/bills" className="text-blue-600">View All →</Link>
                </div>

                <div className="grid grid-cols-3 gap-6 mt-4">
                    {expenses.slice(0, 3).map(b => (
                        <div key={b._id} className="shadow rounded-xl overflow-hidden">
                            <img src={b.image ? `${b.image}` : `https://rolibooks.com/wp-content/uploads/2022/09/no-inage.jpg`} className="h-40 w-full object-cover" />
                            <div className="p-3">
                                <p className="font-semibold">{b.merchant}</p>
                                <p>₹{b.amount}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
