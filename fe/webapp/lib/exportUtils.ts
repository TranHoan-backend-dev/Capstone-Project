// Utility functions for exporting and printing data

export interface ExportColumn {
  key: string;
  label: string;
}

interface ExportData {
  [key: string]: any;
}

// Export to CSV (can be opened with Excel)
export const exportToCSV = (data: ExportData[], columns: ExportColumn[], filename: string) => {
  const headers = columns.map((col) => col.label).join(",");
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const value = row[col.key];
        // Escape commas and quotes in values
        if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(",")
  );

  const csv = [headers, ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }); // UTF-8 BOM for Excel
  downloadFile(blob, `${filename}.csv`);
};

// Export to HTML and download as file (can be opened with any browser and converted to PDF/Word)
export const exportToHTML = (data: ExportData[], columns: ExportColumn[], filename: string) => {
  const headers = columns.map((col) => `<th>${col.label}</th>`).join("");
  const rows = data
    .map(
      (row) =>
        `<tr>${columns.map((col) => `<td>${row[col.key]}</td>`).join("")}</tr>`
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #999;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
      </style>
    </head>
    <body>
      <h2>${filename}</h2>
      <p>Dự liệu được xuất lúc: ${new Date().toLocaleString("vi-VN")}</p>
      <table>
        <thead><tr>${headers}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
  downloadFile(blob, `${filename}.html`);
};

// Export to JSON
export const exportToJSON = (data: ExportData[], columns: ExportColumn[], filename: string) => {
  // Filter data to only include columns that are defined
  const filteredData = data.map((row) => {
    const filteredRow: ExportData = {};
    columns.forEach((col) => {
      filteredRow[col.label] = row[col.key];
    });
    return filteredRow;
  });

  const json = JSON.stringify(filteredData, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
  downloadFile(blob, `${filename}.json`);
};

// Helper function to trigger download
const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Print functionality
export const printData = (data: ExportData[], columns: ExportColumn[], title: string) => {
  const headers = columns.map((col) => `<th>${col.label}</th>`).join("");
  const rows = data
    .map(
      (row) =>
        `<tr>${columns.map((col) => `<td>${row[col.key]}</td>`).join("")}</tr>`
    )
    .join("");

  const printWindow = window.open("", "", "height=600,width=800");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        h1 {
          text-align: center;
          color: #333;
        }
        p {
          text-align: center;
          color: #666;
          font-size: 0.9em;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #999;
          padding: 10px;
          text-align: left;
          font-size: 0.9em;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        @media print {
          body {
            margin: 0;
            padding: 10px;
          }
          table {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p>In lúc: ${new Date().toLocaleString("vi-VN")}</p>
      <table>
        <thead><tr>${headers}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </body>
    </html>
  `);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
  }, 250);
};
