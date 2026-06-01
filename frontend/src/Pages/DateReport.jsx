// import { useState } from "react";
// import { downloadReport } from "../api/stampApi";


// export default function DateReport() {
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleDownload = async (e) => {
//     e.preventDefault();

//     if (!fromDate || !toDate) {
//       alert("Please select both dates");
//       return;
//     }

//     try {
//       setLoading(true);

//       const csvBlob = await downloadReport(fromDate, toDate);

//       const url = window.URL.createObjectURL(
//         new Blob([csvBlob], { type: "text/csv" })
//       );

//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `report-${fromDate}-to-${toDate}.csv`;
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       console.error(error);
//       alert("Failed to download report");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
//       <h2 className="text-2xl font-bold text-center mb-6">
//         Download CSV Report
//       </h2>

//       <form onSubmit={handleDownload} className="space-y-4">
//         {/* From Date */}
//         <input
//           type="date"
//           value={fromDate}
//           onChange={(e) => setFromDate(e.target.value)}
//           className="w-full border p-2 rounded-md"
//         />

//         {/* To Date */}
//         <input
//           type="date"
//           value={toDate}
//           onChange={(e) => setToDate(e.target.value)}
//           className="w-full border p-2 rounded-md"
//         />

//         {/* Button */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition disabled:bg-gray-400"
//         >
//           {loading ? "Downloading..." : "Download CSV"}
//         </button>
//       </form>
//     </div>
//   );
// }



import { useState } from "react";
import { downloadReport } from "../api/stampApi";

export default function DateReport() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async (e) => {
    e.preventDefault();

    if (!fromDate || !toDate) {
      alert("Please select both dates");
      return;
    }

    try {
      setLoading(true);

      // Get PDF Blob
      const pdfBlob = await downloadReport(fromDate, toDate);

      // Create URL
      const url = window.URL.createObjectURL(
        new Blob([pdfBlob], {
          type: "application/pdf",
        })
      );

      // Create Link
      const link = document.createElement("a");

      link.href = url;

      link.download = `report-${fromDate}-to-${toDate}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);

      alert("Failed to download PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-6">
        Download PDF Report
      </h2>

      <form onSubmit={handleDownload} className="space-y-4">
        {/* From Date */}
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="w-full border p-2 rounded-md"
        />

        {/* To Date */}
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="w-full border p-2 rounded-md"
        />

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition disabled:bg-gray-400"
        >
          {loading ? "Downloading..." : "Download PDF"}
        </button>
      </form>
    </div>
  );
}