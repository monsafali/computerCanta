import axios from "axios";
const API = import.meta.env.VITE_API_URL



export const getsr = async () => {
  const response = await axios.get(
    `${API}/api/v1/sr`
  );

  return response.data;
};


export const generateStamp = async (data) => {
  const response = await axios.post(`${API}/api/v1/generate`, data, {
    responseType: "blob",
  });
  return response.data;
};





export const searchStamp = async (Sr_No) => {
  const response = await axios.post(
    `${API}/api/v1/search`,
    { Sr_No },
    { responseType: "blob" }
  );

  return response.data;
};



export const downloadReport = async (fromDate, toDate) => {
  const response = await axios.post(
    `${API}/api/v1/searchDate`,
    {
      fromDate,
      toDate,
    },
    {
      responseType: "blob",
    }
  );

  return response.data;
};



export const deleteProduct = async (SrNo) => {
  const response = await axios.delete(
    `${API}/api/v1/product/${SrNo}`
  );

  return response.data;
};
