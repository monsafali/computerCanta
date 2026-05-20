import path from "path";
import puppeteer from "puppeteer";

import Product from "../models/Product.js";
import stampTemplate from "../templates/stampTemplate.js";
import numberToWords from "../utils/numberToWords.js";
import generateStampData from "../utils/generateStampData.js";

import { Parser } from "json2csv";


const __dirname = path.resolve();

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

    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    const products = await Product.find().lean();

    const filtered = products.filter((item) => {
      if (!item.Date) return false;

      const [dd, mm, yy] = item.Date.split("-");

      const fullYear = Number(yy) < 50 ? `20${yy}` : `19${yy}`;

      const itemDate = new Date(`${fullYear}-${mm}-${dd}`);

      return itemDate >= from && itemDate <= to;
    });

    if (!filtered.length) {
      return res.status(404).send("No records found");
    }

    // ⭐ TOTAL CASH
    const totalCash = filtered.reduce((sum, item) => {
      return sum + (Number(item.Cash) || 0);
    }, 0);

    // CSV fields
    const fields = [
      "Sr_No",
      "vehicle",
      "Party",
      "Product",
      "Gross",
      "Tare",
      "Cash",
      "Date",
      "GrossTime",
      "TareTime",
    ];

    const { Parser } = await import("json2csv");
    const parser = new Parser({ fields });

    const csv = parser.parse(filtered);

    // append total row at bottom
    const finalCsv = csv + `\n\nTotal Cash,, , , , ,${totalCash}`;

    res.header("Content-Type", "text/csv");
    res.attachment("report.csv");

    return res.send(finalCsv);
  } catch (error) {
    console.error(error);
    res.status(500).send("CSV export failed");
  }
};
