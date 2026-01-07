export const DocumentHeader = () => {
  return (
    <div className="grid grid-cols-2 gap-8 mb-6 text-xs">
      <div>
        <div className="font-bold uppercase">
          CÔNG TY CỔ PHẦN CẤP NƯỚC NAM ĐỊNH
        </div>
        <div className="mt-3">
          <span className="font-semibold">Mã đơn:</span> 01021110027
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
          TP Nam Định, Ngày 05 tháng 11 năm 2021
        </div>
      </div>
    </div>
  );
};
