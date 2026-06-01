import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex gap-6">
      <Link to="/" className="hover:underline">
        Create Stamp
      </Link>

      <Link to="/search" className="hover:underline">
        Search Stamp
      </Link>

      <Link to="/report" className="hover:underline">
         Report
      </Link>

         <Link to="/delete" className="hover:underline">
        Delete Product
      </Link>
    </nav>
  );
}
