"use client";

interface Column {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  render?: (row: any) => React.ReactNode;
}

export const DocumentTable = ({
  data,
  columns,
}: {
  data: any[];
  columns: Column[];
}) => {
  const getAlignClass = (align?: string) => {
    switch (align) {
      case "left":
        return "text-left";
      case "right":
        return "text-right";
      default:
        return "text-center";
    }
  };

  const baseStyle = "border border-black px-2 py-1";

  return (
    <table className="w-full border-collapse text-xs border border-black">
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className={`${baseStyle} ${getAlignClass(col.align)}`}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, index) => (
          <tr key={row.id || index}>
            {columns.map((col) => (
              <td
                key={col.key}
                className={`${baseStyle} ${getAlignClass(col.align)}`}
              >
                {col.render ? col.render(row) : (row[col.key] ?? "-")}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
