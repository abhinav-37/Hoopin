# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration for your Hoopin waitlist website.

## Method 1: Google Apps Script (Recommended)

### Step 1: Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Hoopin Waitlist"
4. Set up columns in the first row:
   - A1: Name
   - B1: Email
   - C1: Society
   - D1: City
   - E1: Workplace
   - F1: Timestamp
   - G1: User Agent
   - H1: Referrer

### Step 2: Create Google Apps Script
1. In your Google Sheet, go to `Extensions` > `Apps Script`
2. Delete the default code and paste the following:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Parse the JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Add data to the sheet
    sheet.appendRow([
      data.name,
      data.email,
      data.society,
      data.city,
      data.workplace,
      data.timestamp,
      data.userAgent,
      data.referrer
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({message: "Hoopin Waitlist API is running"}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Step 3: Deploy the Script
1. Click `Deploy` > `New deployment`
2. Choose type: `Web app`
3. Set execute as: `Me`
4. Set access: `Anyone`
5. Click `Deploy`
6. Copy the Web App URL

### Step 4: Update Your Website
1. Open `script.js`
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your Web App URL
3. Save the file

## Method 2: Google Forms (Alternative)

### Step 1: Create a Google Form
1. Go to [Google Forms](https://forms.google.com)
2. Create a new form titled "Hoopin Waitlist"
3. Add these fields:
   - Name (Short answer, Required)
   - Email (Email type, Required)
   - Society (Short answer, Required)
   - City (Short answer, Required)
   - Workplace (Short answer, Required)
   - Timestamp (Short answer, Optional)

### Step 2: Get Form Details
1. Click the three dots menu > `Get pre-filled link`
2. Fill out the form with sample data
3. Click `Get link`
4. Copy the URL and extract the form ID and field IDs

### Step 3: Update JavaScript
1. In `script.js`, find the `submitToGoogleSheetsAlternative` function
2. Replace `YOUR_FORM_ID` with your form ID
3. Replace field IDs (`NAME_FIELD_ID`, `EMAIL_FIELD_ID`, `SOCIETY_FIELD_ID`, `CITY_FIELD_ID`, `WORKPLACE_FIELD_ID`, etc.) with actual IDs from the pre-filled URL

## Testing Your Setup

### Test the Integration
1. Open your website in a browser
2. Fill out the waitlist form
3. Submit the form
4. Check your Google Sheet for the new entry

### Troubleshooting
- **CORS errors**: Make sure your Apps Script is deployed with "Anyone" access
- **No data appearing**: Check the Apps Script execution log for errors
- **Form not submitting**: Check browser console for JavaScript errors

## Security Considerations

### Rate Limiting
Add this to your Apps Script to prevent spam:

```javascript
function doPost(e) {
  // Simple rate limiting by IP (optional)
  const cache = CacheService.getScriptCache();
  const clientIP = e.parameter.clientIP || 'unknown';
  const cacheKey = 'rate_limit_' + clientIP;
  
  if (cache.get(cacheKey)) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: 'Rate limit exceeded'}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Set cache for 1 minute
  cache.put(cacheKey, 'true', 60);
  
  // ... rest of your code
}
```

### Email Validation
The client-side validation is already implemented, but you can add server-side validation in Apps Script:

```javascript
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  
  if (!isValidEmail(data.email)) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: 'Invalid email'}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // ... rest of your code
}
```

## Analytics Integration

### Google Analytics 4
Add this to your HTML `<head>` section:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

Replace `GA_MEASUREMENT_ID` with your actual Google Analytics measurement ID.

## Data Export

### Automatic Backup
Set up a trigger in Apps Script to automatically backup your data:

```javascript
function createBackup() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // Create backup sheet with timestamp
  const backupName = 'Backup_' + Utilities.formatDate(new Date(), 'GMT', 'yyyy-MM-dd_HH-mm');
  const backupSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(backupName);
  
  // Copy data to backup
  if (data.length > 0) {
    backupSheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  }
}
```

Set up a time-driven trigger to run this function daily or weekly.

## Next Steps

1. Set up your Google Sheet and Apps Script
2. Update the JavaScript file with your URLs
3. Test the integration thoroughly
4. Consider adding analytics tracking
5. Set up automated backups
6. Monitor form submissions regularly

Your Hoopin waitlist website is now ready to collect user data directly into Google Sheets!
