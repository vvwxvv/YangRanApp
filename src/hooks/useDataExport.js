
import { useCallback } from "react";
import * as XLSX from "xlsx";
import { downloadCSV } from "@/utils/downloadCSV";

// Custom hook for data export
const useDataExport = () => {
  const handleExport = useCallback((data, format = 'csv', filename = 'export', sheetName = '_') => {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('No data available for export');
      return;
    }

    // Clean data by removing internal IDs and handling null/undefined values
    const exportData = data.map(row => {
      const { id, _id, ...exportRow } = row;
      // Convert null/undefined values to empty strings for better CSV compatibility
      const cleanedRow = {};
      Object.keys(exportRow).forEach(key => {
        cleanedRow[key] = exportRow[key] !== null && exportRow[key] !== undefined ? exportRow[key] : '';
      });
      return cleanedRow;
    });

    // Get app person from environment variable and process it
    let appPerson = process.env.NEXT_PUBLIC_APP_PERSON_EN;
    
    // If appPerson exists and is not empty, replace spaces with underscores
    if (appPerson && appPerson.trim()) {
      appPerson = appPerson.trim().replace(/\s+/g, '_');
    } else {
      appPerson = 'app'; // Default fallback
    }
    
    const timestamp = new Date().toISOString().split("T")[0].replace(/-/g, '_');
    
    // Convert language codes to uppercase (cn -> CN, en -> EN)
    const processedFilename = filename
      .replace(/_cn/g, '_CN')
      .replace(/_en/g, '_EN');
    
    if (format.toLowerCase() === 'csv') {
      // Use CSV export
      const csvFilename = `${appPerson}_${processedFilename.replace('export', '').replace('data', '_')}_${timestamp}.csv`;
      downloadCSV(exportData, csvFilename);
    } else {
      // Use Excel export (default behavior)
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      XLSX.writeFile(workbook, `${appPerson}_${processedFilename.replace('export', '').replace('data', '_')}_${timestamp}.xlsx`);
    }
  }, []);

  return { handleExport };
};

export default useDataExport;