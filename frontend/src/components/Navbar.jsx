import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    const active = useLocation().pathname;

    const linkClass = (path) =>
        `px-3 py-1 rounded ${active === path ? "bg-purple-600 text-white" : "text-gray-200"
        }`;

    return (
        <nav className="bg-gray-900 text-white p-4 flex justify-between shadow-lg sticky top-0 z-50">
            <h1 className="text-xl font-bold">Finance Tracker</h1>

            <div className="flex gap-5">
                <Link to="/" className={linkClass("/")}>Dashboard</Link>
                <Link to="/recent" className={linkClass("/recent")}>Recent Activity</Link>
                <Link to="/bills" className={linkClass("/bills")}>Bills</Link>
                <Link to="/upload" className={linkClass("/upload")}>Upload Receipt</Link>
                <Link to="/add-expense" className={linkClass("/add-expense")}>Add Expense</Link>
            </div>
        </nav>
    );
}
