

import {  Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";


import DateReport from "./Pages/DateReport";
import SearchStamp from "./Pages/SearchStamp";
import StampForm from "./Pages/StampForm";


function App() {
  return (

    <>

      <Navbar />

      <Routes>
        <Route path="/" element={<StampForm />} />
        <Route path="/search" element={<SearchStamp />} />
        <Route path="/report" element={<DateReport />} />
      </Routes>
      </>

  );
}

export default App;
