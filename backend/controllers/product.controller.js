import path from "path";
import puppeteer from "puppeteer";

import Product from "../models/Product.js";
import stampTemplate from "../templates/stampTemplate.js";
import numberToWords from "../utils/numberToWords.js";
import generateStampData from "../utils/generateStampData.js";

import { Parser } from "json2csv";


const __dirname = path.resolve();



export const getSr = async (req, res) => {
  try {
    const product = await Product.findOne().sort({ Sr_No: -1 });

    if (!product) {
      return res.json(0); // or 1 depending on your system
    }

    return res.json(product.Sr_No+1);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const GenerateProduct = async (req, res) => {
  try {
    // FRONTEND DATA
    const bodyData = req.body;

    // GENERATE ALL AUTO VALUES
    const finalData = generateStampData(bodyData);

    // SAVE IN DATABASE
    const savedProduct = await Product.create(finalData);

    // GENERATE HTML
    const html = stampTemplate(finalData);

    // PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=stamp.pdf"
    );

    res.setHeader("Content-Length", pdfBuffer.length);

    res.end(pdfBuffer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};



export const SearchProduct = async (req, res) => {

  try {

    const { Sr_No } = req.body;

    const product = await Product.findOne({ Sr_No });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const html = stampTemplate(product);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=stamp.pdf"
    );

    res.end(pdfBuffer);

  } catch (error) {
    console.error(error);

    res.status(500).send("Preview failed");
  }
};



export const SearchDate = async (req, res) => {
  try {
    const { fromDate, toDate } = req.body;

    // DATE CONVERT
    const from = new Date(fromDate);

    const to = new Date(toDate);

    to.setHours(23, 59, 59, 999);

    // GET PRODUCTS
    const products = await Product.find().lean();

    // FILTER DATA
    const filtered = products.filter((item) => {
      if (!item.Date) return false;

      const [dd, mm, yy] = item.Date.split("-");

      const fullYear = Number(yy) < 50
        ? `20${yy}`
        : `19${yy}`;

      const itemDate = new Date(
        `${fullYear}-${mm}-${dd}`
      );

      return itemDate >= from && itemDate <= to;
    });

    // NO RECORD
    if (!filtered.length) {
      return res.status(404).send("No records found");
    }

    // TOTAL CASH
    const totalCash = filtered.reduce((sum, item) => {
      return sum + (Number(item.Cash) || 0);
    }, 0);

    // HTML TEMPLATE
    const html = `
      <!DOCTYPE html>
      <html>

      <head>
        <style>

          body{
            font-family: Arial, sans-serif;
            padding:20px;
          }

          h1{
            text-align:center;
            margin-bottom:20px;
          }

          .date{
            margin-bottom:20px;
            font-size:14px;
          }

          table{
            width:100%;
            border-collapse:collapse;
          }

          th, td{
            border:1px solid #000;
            padding:8px;
            text-align:center;
            font-size:12px;
          }

          th{
            background:#f2f2f2;
          }

          .total{
            margin-top:20px;
            text-align:right;
            font-size:18px;
            font-weight:bold;
          }

        </style>
      </head>

      <body>

        <h1>Product Report</h1>

        <div class="date">
          <strong>From:</strong> ${fromDate}
          &nbsp;&nbsp;&nbsp;
          <strong>To:</strong> ${toDate}
        </div>

        <table>

          <thead>
            <tr>
              <th>Sr No</th>
              <th>Vehicle</th>
              <th>Party</th>
              <th>Product</th>
              <th>Gross</th>
              <th>Tare</th>
              <th>Cash</th>
              <th>Date</th>
              <th>Gross Time</th>
              <th>Tare Time</th>
            </tr>
          </thead>

          <tbody>

            ${filtered
              .map(
                (item, index) => `
                <tr>
                  <td>${item.Sr_No}</td>
                  <td>${item.vehicle || ""}</td>
                  <td>${item.Party || ""}</td>
                  <td>${item.Product || ""}</td>
                  <td>${item.Gross || ""}</td>
                  <td>${item.Tare || ""}</td>
                  <td>${item.Cash || ""}</td>
                  <td>${item.Date || ""}</td>
                  <td>${item.GrossTime || ""}</td>
                  <td>${item.TareTime || ""}</td>
                </tr>
              `
              )
              .join("")}

          </tbody>

        </table>

        <div class="total">
          Total Cash: ${totalCash}
        </div>

      </body>
      </html>
    `;

    // PDF GENERATE
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
    });

    await browser.close();

    // SEND PDF
    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=report.pdf"
    );

    res.setHeader(
      "Content-Length",
      pdfBuffer.length
    );

    res.end(pdfBuffer);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
