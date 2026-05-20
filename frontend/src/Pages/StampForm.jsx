import { useState } from "react";
import { generateStamp } from "../api/stampApi";
import products from "../../products";

export default function StampForm() {
  const [formData, setFormData] = useState({
    vehicle: "",
    Party: "",
    Product: "",
    ProductId: "",
    Sr_No: "",
    Gross: "",
    Tare: "",
    Cash: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle normal input
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Don't uppercase numbers
    const isTextField = ["vehicle", "Party", "Product"].includes(name);

    setFormData({
      ...formData,
      [name]: isTextField ? value.toUpperCase() : value,
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const pdfBlob = await generateStamp(formData);

      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "e-stamp.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      alert("Duplicate SR Not allowed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-6">Generate Wazum</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vehicle */}
        <input
          placeholder="sr no"
          name="Sr_No"
          value={formData.Sr_No}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        />
        <input
          placeholder="Vehicle"
          name="vehicle"
          value={formData.vehicle}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        />

        {/* Party */}
        <input
          placeholder="Party"
          name="Party"
          value={formData.Party}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        />

        {/* Product Code Input */}
        <input
          placeholder="Enter Product Code (e.g. 9)"
          onChange={(e) => {
            const val = e.target.value;

            if (products[val]) {
              setFormData({
                ...formData,
                Product: products[val],
                ProductId: val,
              });
            }
          }}
          className="w-full border p-2 rounded-md"
        />

        <select
          name="Product"
          value={formData.Product}
          onChange={(e) => {
            const selectedName = e.target.value;

            // find id from products object
            const selectedId = Object.keys(products).find(
              (key) => products[key] === selectedName,
            );

            setFormData({
              ...formData,
              Product: selectedName,
              ProductId: selectedId,
            });
          }}
          className="w-full border p-2 rounded-md"
        >
          <option value="">Select Product</option>
          {Object.entries(products).map(([id, name]) => (
            <option key={id} value={name}>
              {id} - {name}
            </option>
          ))}
        </select>

        {/* Gross */}
        <input
          placeholder="Gross"
          name="Gross"
          value={formData.Gross}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        />

        {/* Tare */}
        <input
          placeholder="Tare"
          name="Tare"
          value={formData.Tare}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        />

        {/* Cash */}
        <input
          placeholder="Cash"
          name="Cash"
          value={formData.Cash}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "please wait..." : "Generate E Stamp"}
        </button>
      </form>
    </div>
  );
}
