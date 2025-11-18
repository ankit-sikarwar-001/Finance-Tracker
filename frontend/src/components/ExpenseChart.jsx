import {
    PieChart,
    Pie,
    Tooltip,
    Legend,
    Cell
} from "recharts";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444"];

export default function ExpenseChart({ data }) {
    return (
        <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Expenses Breakdown</h2>

            <PieChart width={350} height={300}>
                <Pie
                    data={data}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                >
                    {data.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                </Pie>

                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
}
