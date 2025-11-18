import axios from "axios";
import { useEffect, useState } from "react";

export default function Bills() {
    const [bills, setBills] = useState([]);

    useEffect(() => {
        let resul = axios.get("http://localhost:5000/api/expenses")
        resul.then(res => setBills(res.data));
    }, []);

    // console.log(bills[0]);
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Uploaded Bills</h2>

            <div className="grid grid-cols-3 gap-6">
                {bills.map(b => (
                    <div key={b._id} className="bg-white p-4 rounded shadow">
                        <img src={`http://localhost:5000${b.image}`} className="h-48 object-cover mb-3" />
                        <p><strong>{b.merchant}</strong></p>
                        <p>Amount: ₹{b.amount}</p>
                        <p>Category: {b.category}</p>
                        <p className="text-sm">{b.date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
