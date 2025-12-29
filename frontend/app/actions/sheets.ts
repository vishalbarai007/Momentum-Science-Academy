'use server';

import { google } from 'googleapis';

async function getSheetsInstance() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

export async function getSchoolData(schoolName: string) {
  try {
    const sheets = await getSheetsInstance();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // We fetch A to H to include all fields up to 'Called By'
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${schoolName}!A2:H200`, 
    });

    const rows = response.data.values || [];

    return rows.map((row, index) => ({
      rowNumber: index + 2,
      name: row[0] || "-",
      mobile: row[1] || "-",     // Column B (Mobile index 1 & 2 if colspan)
      callingDate: row[3] || "-", // Column D (Index 3)
      response: row[4] || "-",    // Column E (Index 4)
      followUp: row[5] || "-",    // Column F (Index 5)
      comments: row[6] || "-",    // Column G (Index 6)
      calledBy: row[7] || "-",    // Column H (Index 7)
    }));
  } catch (error) {
    console.error("Sheet fetch error:", error);
    return [];
  }
}

export async function updateSheetRow(schoolName: string, rowNumber: number, data: any) {
  try {
    const sheets = await getSheetsInstance();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Map fields back to sheet columns starting from D to H
    const values = [[
      data.callingDate, // Col D (New)
      data.response,    // Col E
      data.followUp,    // Col F
      data.comments,    // Col G
      data.calledBy     // Col H
    ]];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${schoolName}!D${rowNumber}:H${rowNumber}`, // Range expanded to D-H
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });
    return { success: true };
  } catch (error) {
    console.error("Update error:", error);
    return { success: false };
  }
}

export async function appendLeadToSheet(schoolName: string, name: string, mobile: string) {
  try {
    const sheets = await getSheetsInstance();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // We append to columns A and B (Name and Mobile)
    const values = [[
        name, 
        mobile, 
        "",           // Col C: Calling Date
        "",
        "Will Visit"  // Col E: Response Status
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${schoolName}!A:E`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values },
    });
    return { success: true };
  } catch (error) {
    console.error("Error appending lead to sheet:", error);
    return { success: false };
  }
}