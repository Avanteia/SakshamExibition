/**
 * Saksham registration form -> Google Sheet
 * https://docs.google.com/spreadsheets/d/10-rwswOTbC6pRsDfUFJniBhDe0ClGwp7Y50DDjuqxHA/edit
 *
 * ONE-TIME SETUP
 * 1. Open the Google Sheet above.
 * 2. Extensions -> Apps Script.
 * 3. Delete any starter code in Code.gs and paste this whole file in its place.
 * 4. Click Deploy -> New deployment.
 *    - Select type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Click Deploy and authorize the permissions Google asks for (it's your own script,
 *    on your own sheet — this is expected).
 * 6. Copy the Web app URL (ends in /exec).
 * 7. Open js/script.js in the site and replace:
 *      const SHEETS_ENDPOINT = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
 *    with the URL you just copied.
 * 8. Whenever you edit this script again, you must create a NEW deployment version
 *    (Deploy -> Manage deployments -> edit -> New version) for changes to take effect.
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Registrations');
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Registrations');
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Phone', 'Email', 'Type', 'Competition / Stall Type', 'Fee (Rs)', 'Payment Reference']);
  }

  var p = e.parameter;
  sheet.appendRow([
    new Date(),
    p.name || '',
    p.phone || '',
    p.email || '',
    p.type || '',
    p.detail || '',
    p.fee || '',
    p.paymentRef || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
