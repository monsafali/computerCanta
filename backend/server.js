import express from "express";

import cors from "cors";
import dotenv from "dotenv";

import ProductRoute from "./routes/product.route.js";
import { ConnectDb } from "./config/db.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// ✅ Middleware
app.use(express.json());


app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development" ? process.env.FRONTEND_URL : "*",
    credentials: true,
  }),
);




app.use("/api/v1", ProductRoute)






// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "frontend/dist/index.html")),
  );
}




app.listen(PORT, ()=>{
  ConnectDb()
  console.log(`Server running on port ${PORT}`)
})
