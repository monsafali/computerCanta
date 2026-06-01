import { useState, useEffect } from "react";
import { generateStamp ,getsr} from "../api/stampApi";
import products from "../../products";

const initialFormData = {
  vehicle: "",
  Party: "",
  Product: "",
  ProductId: "",
  Sr_No: "",
  Gross: "",
  Tare: "",
  Cash: "",
};


export default function StampForm() {


const fetchSr = async () => {
  try {
    const sr = await getsr();

    setFormData((prev) => ({
      ...prev,
      Sr_No: sr,
    }));
  } catch (err) {
    console.error("SR fetch failed", err);
  }
};


  const [formData, setFormData] = useState(initialFormData);

  const [loading, setLoading] = useState(false);

  // localStorage se dark mode load
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // dark mode save
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);
  useEffect(() => {
  fetchSr();
}, []);

  const inputClass = `w-full border p-2 rounded-md ${
    darkMode
      ? "bg-gray-800 text-white border-gray-600"
      : "bg-white text-black border-gray-300"
  }`;

  const handleChange = (e) => {
    const { name, value } = e.target;
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

  setFormData(initialFormData);

  // 🔥 IMPORTANT: fetch new SR after save
  fetchSr();

} catch (err) {
  console.error(err);
  alert("Duplicate SR Not allowed");
}finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex justify-center items-start pt-10 transition-all duration-300 ${
        darkMode ? "bg-gray-950 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div
        className={`max-w-md w-full p-6 shadow-lg rounded-xl ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        {/* Toggle */}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-md font-medium transition ${
              darkMode
                ? "bg-gray-700 text-black hover:bg-yellow-300"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>

        <h2
          className={`text-2xl font-bold text-center mb-6 ${
            darkMode ? "text-gray-700" : "text-gray-700"
          }`}
        >
          BANK OF UNLIMITED
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="sr no"
            name="Sr_No"
            value={formData.Sr_No}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            placeholder="Vehicle"
            name="vehicle"
            value={formData.vehicle}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            placeholder="Party"
            name="Party"
            value={formData.Party}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            placeholder="Enter Product Code"
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
            className={inputClass}
          />

          <select
            name="Product"
            value={formData.Product}
            onChange={(e) => {
              const selectedName = e.target.value;

              const selectedId = Object.keys(products).find(
                (key) => products[key] === selectedName
              );

              setFormData({
                ...formData,
                Product: selectedName,
                ProductId: selectedId,
              });
            }}
            className={inputClass}
          >
            <option value="" >Select Product</option>
            {Object.entries(products).map(([id, name]) => (
              <option key={id} value={name}>
                {id} - {name}
              </option>
            ))}
          </select>

          <input
            placeholder="Gross"
            name="Gross"
            value={formData.Gross}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            placeholder="Tare"
            name="Tare"
            value={formData.Tare}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            placeholder="Cash"
            name="Cash"
            value={formData.Cash}
            onChange={handleChange}
            className={inputClass}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md font-medium transition ${
              darkMode
                ? "bg-gray-700 text-white hover:bg-green-900"
                : "bg-gray-800 text-white hover:bg-gray-900"
            }`}
          >
            {loading ? "Please wait..." : "MONEY GENERATE"}
          </button>
        </form>
      </div>
    </div>
  );
}
