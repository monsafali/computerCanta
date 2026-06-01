import React, { useState } from "react";
import { deleteProduct } from "../api/stampApi";

const DeleteProduct = () => {
  const [SrNo, setSrNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleDeleteProduct = async (e) => {
    e.preventDefault();

    if (!SrNo.trim()) return;

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const res = await deleteProduct(SrNo);

      setMessage(res.message || "Product deleted successfully");
      setSrNo("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-6 border">
      <h2 className="text-2xl font-bold text-center mb-6">
        Delete Product
      </h2>

      <form onSubmit={handleDeleteProduct} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Serial Number
          </label>

          <input
            type="number"
            value={SrNo}
            onChange={(e) => setSrNo(e.target.value)}
            placeholder="Enter Sr No"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "Deleting..." : "Delete Product"}
        </button>
      </form>

      {message && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default DeleteProduct;
