import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function UploadReceipt() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleFileSelect = (e) => {
        setFile(e.target.files[0]);
        setResult(null);
    };

    const processOCR = () => {
        if (!file) return toast.error("Please select a file first!");

        setLoading(true);

        const form = new FormData();
        form.append("receipt", file);

        axios.post("http://localhost:5000/api/upload", form)
            .then(res => {
                setResult(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-gray-100 p-5">
            <div className="bg-white shadow-xl p-8 rounded-xl w-full max-w-lg">

                <h2 className="text-3xl font-bold text-center mb-6">
                    Upload Receipt & Run OCR
                </h2>

                {/* File Upload Box */}
                <input
                    type="file"
                    className="w-full p-3 border rounded mb-4"
                    onChange={handleFileSelect}
                />

                {/* Process OCR Button */}
                <button
                    onClick={processOCR}
                    disabled={!file || loading}
                    className="w-full py-3 rounded-lg text-white font-semibold 
                               bg-blue-600 hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                    {loading ? "Processing..." : "Process OCR"}
                </button>

                {/* OCR RESULT */}
                {result && (
                    <div className="mt-6 p-4 bg-green-100 rounded-lg shadow-sm">
                        <h3 className="font-bold text-lg mb-2">OCR Result</h3>
                        <p><strong>Merchant:</strong> {result.merchant}</p>
                        <p><strong>Amount:</strong> ₹{result.amount}</p>
                        <p><strong>Category:</strong> {result.category}</p>
                        <p><strong>Date:</strong> {result.date}</p>

                        {/* Go to Dashboard */}
                        <button
                            onClick={() => navigate("/")}
                            className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 
                                       text-white font-semibold rounded-lg cursor-pointer"
                        >
                            Save & Go to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
