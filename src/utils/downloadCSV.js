// utils/downloadCSV.js
export function downloadCSV(data, fileName) {
  if (!data || data.length === 0) {
    alert("No data available to download!");
    return;
  }

  // Extract headers dynamically from the keys of the first object
  const headers = Object.keys(data[0]);

  // Helper function to escape CSV values
  const escapeCSVValue = (value) => {
    if (value === null || value === undefined) {
      return '';
    }
    
    const stringValue = String(value);
    
    // If the value contains comma, quote, or newline, wrap it in quotes and escape internal quotes
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
  };

  // Generate the CSV content
  const csvHeaders = headers.map(header => escapeCSVValue(header)).join(","); // Create header row
  const csvRows = data.map((row) =>
    headers.map((header) => escapeCSVValue(row[header])).join(",")
  ); // Map data rows to match headers
  const csvContent = [csvHeaders, ...csvRows].join("\n");

  // Create a Blob and generate a download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  // Create an anchor element and trigger a download
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName; // Use the fileName passed as a parameter
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);
}