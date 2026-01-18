"use server"

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

const RESPONSE_OPTIONS = [
  "Ringing",
  "Out of Town",
  "Will Visit",
  "Admission Taken",
  "Not Interested",
  "Call Busy",
  "Call Cut",
  "Call Later",
  "Wrong Number",
  "Network Issue"
];

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
      "",           // Col C: Empty (Merged with B)
      "",           // Col D: Calling Date
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

// frontend/app/actions/sheets.ts

// ... keep existing imports and getSheetsInstance function

export async function createSchoolSheet(schoolName: string) {
  try {
    const sheets = await getSheetsInstance();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // 1. Create the new tab
    const response = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{
          addSheet: {
            properties: { title: schoolName }
          }
        }]
      }
    });

    const newSheetId = response.data.replies?.[0]?.addSheet?.properties?.sheetId;

    if (newSheetId === undefined) throw new Error("Failed to get new sheet ID");

    // 2. Initialize headers and formatting
    const headers = [["Name", "Mobile", "", "Calling Date", "Response", "Follow Up", "Comments", "Called By"]];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${schoolName}!A1:H1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: headers },
    });

    // 3. Merge B1:C1 for Mobile Header and Add Dropdown Validation for Response (Col E)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            mergeCells: {
              range: {
                sheetId: newSheetId,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 1, // Col B
                endColumnIndex: 3    // Col D (Exclusive, so B and C)
              },
              mergeType: "MERGE_ALL"
            }
          },
          {
            setDataValidation: {
              range: {
                sheetId: newSheetId,
                startRowIndex: 1, // Start from row 2 (index 1)
                endRowIndex: 1000,
                startColumnIndex: 4, // Col E (Response)
                endColumnIndex: 5
              },
              rule: {
                condition: {
                  type: 'ONE_OF_LIST',
                  values: RESPONSE_OPTIONS.map(opt => ({ userEnteredValue: opt }))
                },
                showCustomUi: true,
                strict: true
              }
            }
          }
        ]
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Create sheet error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteSchoolSheet(schoolName: string) {
  try {
    const sheets = await getSheetsInstance();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Find the sheet ID by title
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const sheet = spreadsheet.data.sheets?.find(s => s.properties?.title === schoolName);

    if (!sheet?.properties?.sheetId) throw new Error("Sheet not found");

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{
          deleteSheet: { sheetId: sheet.properties.sheetId }
        }]
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Delete sheet error:", error);
    return { success: false };
  }
}

export async function adminAddNewLead(schoolName: string, leadData: { name: string, mobile: string }) {
  try {
    const sheets = await getSheetsInstance();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Values mapping:
    // A: Name, B: Mobile, C: Empty, D: Calling Date (Empty), E: Response, F: Follow Up, G: Comments, H: Called By
    const values = [[
      leadData.name,   // Col A
      leadData.mobile, // Col B
      "",              // Col C (Empty space for layout)
      "",              // Col D (Calling Date)
      "Will Visit",    // Col E (Response)
      "",              // Col F
      "",              // Col G
      ""               // Col H
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${schoolName}!A:H`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values },
    });
    return { success: true };
  } catch (error) {
    console.error("Error adding lead to sheet:", error);
    return { success: false };
  }
}

export async function getAllSchoolSheets() {
  try {
    const sheets = await getSheetsInstance();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    // Map through all sheets and return their titles
    const titles = response.data.sheets?.map(s => s.properties?.title).filter(Boolean) as string[] || [];

    // Optional: Filter out any internal sheets like 'Master' or 'Settings' if they exist
    return titles.filter(title => title !== 'Master');
  } catch (error) {
    console.error("Error fetching sheet titles:", error);
    return [];
  }
}