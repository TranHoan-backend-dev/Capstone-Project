"use client";

interface DocumentHeaderProps {
  code?: string;
  date?: Date;
}

export const DocumentHeader = ({
  code = "Chưa có mã",
  date = new Date(),
}: DocumentHeaderProps) => {
  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

  const [day, month, year] = formattedDate.split("/");

  return (
    <div className="grid grid-cols-2 gap-8 mb-6 text-xs">
      <div>
        <div className="font-bold uppercase">
          CÔNG TY CỔ PHẦN CẤP NƯỚC NAM ĐỊNH
        </div>
        <div className="mt-3">
          <span className="font-semibold">Mã đơn:</span> {code}
        </div>
      </div>

      <div className="text-center">
        <div className="font-bold uppercase">
          CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
        </div>
        <div className="font-semibold underline">
          Độc lập - Tự do - Hạnh phúc
        </div>
        <div className="italic mt-6">
          TP Nam Định, Ngày {day} tháng {month} năm {year}
        </div>
      </div>
    </div>
  );
};
