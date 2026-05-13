import puppeteer from "puppeteer";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generateMilkTransactionPDF = async (req, res, next) => {
  try {
    const { D_owner_id, farmer_id, startDate, endDate } = req.body;
    const farmerName = req.farmerName;

    if (!D_owner_id || !farmer_id || !startDate || !endDate || !farmerName) {
      return res
        .status(400)
        .json({ success: false, message: "Missing details" });
    }

    const [
      finalBill,
      totalMilkPrice,
      totalCowFeedPrice,
      monthlyEmi,
      milkTransactions,
      cowFeedTransactions,
      emiTransactions,
    ] = await Promise.all([
      axios.post(
        "http://localhost:4000/api/D_owner/calculate-final-total-price",
        { D_owner_id, farmer_id, startDate, endDate }
      ),
      axios.post(
        "http://localhost:4000/api/D_owner/calculate-total-milk-price",
        { D_owner_id, farmer_id, startDate, endDate }
      ),
      axios.post(
        "http://localhost:4000/api/D_owner/calculate-total-allocated-cowFeed",
        { D_owner_id, farmer_id, startDate, endDate }
      ),
      axios.post("http://localhost:4000/api/D_owner/get-monthly-emi", {
        D_owner_id,
        farmer_id,
      }),
      axios.post(
        "http://localhost:4000/api/D_owner/get-farmer-all-milk-transaction",
        { D_owner_id, farmer_id, startDate, endDate }
      ),
      axios.post(
        "http://localhost:4000/api/D_owner/get-farmer-cowfeed-transactions",
        { D_owner_id, farmer_id, startDate, endDate }
      ),
      axios.post("http://localhost:4000/api/D_owner/get-all-emi-transaction", {
        D_owner_id,
        farmer_id,
      }),
    ]);

    const transactions = milkTransactions.data.data;
    const cowFeedData = cowFeedTransactions.data.data;
    const emitranstion = emiTransactions.data.data;

    // ✅ Define File Paths
    const pdfFilePath = path.join(
      __dirname,
      `MilkTransactions_${D_owner_id}_${farmer_id}.pdf`
    );

    let htmlContent = `
      <html>
      <head>
        <title>Transaction Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h2, h3, h4 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid black; padding: 8px; text-align: center; }
          th { background-color: #f2f2f2; }
          .total-row { font-weight: bold; font-size: 18px; }
        </style>
      </head>
      <body>
        <h2>Farmers's All Transaction Report</h2>
        <h3>From: ${startDate} - To: ${endDate}</h3>
        <p><strong>Farmer Name:</strong> ${farmerName}</p>


         <h3>Milk Transaction Report</h3>

        <table>
          <tr>
            <th>Date</th>
            <th>Shift</th>
            <th>Fat</th>
            <th>Milk Price</th>
            <th>Total Value</th>
          </tr>`;

    // ✅ Loop through Milk Transactions
    transactions.forEach((tx) => {
      const formattedDate = new Date(tx.date).toISOString().split("T")[0];
      htmlContent += `
          <tr>
            <td>${formattedDate}</td>
            <td>${tx.shift}</td>
            <td>${tx.fat}</td>
            <td>₹${tx.price}</td>
            <td>₹${tx.total_value}</td>
          </tr>`;
    });

    htmlContent += `
        <tr class="total-row">
          <td colspan="5">Total Milk Price: ₹${totalMilkPrice.data.totalMilkPrice}</td>
        </tr>
      </table>

      <h3>Cow Feed Transactions</h3>
      <table>
        <tr>
          <th>Date</th>
          <th>CowFeed Name</th>
          <th>Bags</th>
          <th>Price</th>
          <th>Total Value</th>
        </tr>`;

 
    cowFeedData.forEach((tx) => {
      const formattedDate = new Date(tx.date).toISOString().split("T")[0];
      htmlContent += `
        <tr>
          <td>${formattedDate}</td>
          <td>${tx.cowFeedName}</td>
          <td>${tx.allocated_bags}</td>
          <td>₹${tx.price}</td>
          <td>₹${tx.total_cowFeed_price}</td>
        </tr>`;
    });

    htmlContent += `
      <tr class="total-row">
        <td colspan="5">Total Cow Feed Price: ₹${totalCowFeedPrice.data.data}</td>
      </tr>
    </table>



 <h3>Emi Transactions</h3>
      <table>
        <tr>
          <th>Date</th>
          <th>installment</th>
          <th>Emi price</th>
           <th>Total Payed Amount</th>
          <th>Remaing Amount</th>
         
        </tr>`;

    
    emitranstion.forEach((tx) => {
      const formattedDate = new Date(tx.date).toISOString().split("T")[0];
      htmlContent += `
        <tr>
          <td>${formattedDate}</td>
          <td>${tx.count}</td>
          <td>${tx.monthlyEmi}</td>
        <td>₹${(tx.count ?? 0) * (tx.monthlyEmi ?? 0)}</td>

          <td>₹${tx.remainingAdvancePrice}</td>
        </tr>`;
    });

    htmlContent += `
      
    </table>


   
    <h3>Total Bill: ₹${totalMilkPrice.data.totalMilkPrice} - ₹${totalCowFeedPrice.data.data} - ₹${monthlyEmi.data.data} = ₹${finalBill.data.finalTotalPrice}</h3>
    <h2>Final Amount Payable: ₹${finalBill.data.finalTotalPrice}</h2>
    </body>
    </html>`;

    // ✅ Convert HTML to PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    await page.pdf({
      path: pdfFilePath,
      format: "A4",
      printBackground: true,
    });
    await browser.close();

   
    req.pdfPath = pdfFilePath;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
