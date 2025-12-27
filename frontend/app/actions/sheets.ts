'use server';

import { google } from 'googleapis';

async function getSheetsInstance() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  return google.sheets({ version: 'v4', auth });
}

export async function getDashboardData() {
  try {
    const sheets = await getSheetsInstance();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // FIX: Set range to A2:G to skip the header row (Row 1)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'SVM!A2:G100', // Starts reading from Row 2
    });

    const rows = response.data.values || [];

    return {
      leads: rows.map((row, index) => ({
        id: index,
        name: row[0] || "-",      // Row 2, Col A
        mobile: row[1] || "-",    // Row 2, Col B
        date: row[2] || "-",      // Row 2, Col C
        response: row[3] || "-",  // Row 2, Col D
        followUp: row[4] || "-",  // Row 2, Col E
        comments: row[5] || "-",  // Row 2, Col F
        calledBy: row[6] || "-",  // Row 2, Col G
      }))
    };
  } catch (error) {
    console.error("Sheet fetch error:", error);
    return null;
  }
}