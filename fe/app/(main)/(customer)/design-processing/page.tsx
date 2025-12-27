import React from "react";
import { Metadata } from "next";
import { FilterSection } from "./components/filter-section";
import { OrdersToDesignTable } from "./components/orders-to-design-table";
import { ProcessedDesignsTable } from "./components/processed-designs-table";
import { WaitingInputTable } from "./components/waiting-input-table";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";

const DesignProcessingPage = () => {
    // Mock data for table 1
    const ordersToDesignData = [
        {
            id: 1,
            stt: 1,
            code: "01025120007",
            customerName: "Trần Thị Nguyệt",
            phone: "0355909536",
            address: "Thửa 133, Nghiệp 92/2, Khu CN Hòa Xá, Nam Định",
            registrationDate: "01/12/2025",
            surveyAppointment: "27/11/2025",
            status: "paid", // Đã thu tiền
        },
        {
            id: 2,
            stt: 2,
            code: "01025120124",
            customerName: "Hoàng Thế Quý",
            phone: "0915705720",
            address: "29B, Trần Huy Liệu, P. Thành Nam, TP. Nam Định",
            registrationDate: "26/11/2025",
            surveyAppointment: "27/11/2025",
            status: "processing", // Đang xử lý
        },
    ];

    // Mock data for table 2
    const processedDesignsData = [
        {
            id: 1,
            stt: 1,
            code: "0102580016",
            customerName: "Nguyễn Văn Vũ",
            phone: "0913090736",
            address: "Thửa 344 ngách 31/294, Đường Kênh, Phường Nam Định, TP. Nam Định",
            registrationDate: "06/08/2025",
            surveyAppointment: "07/08/2025",
        },
        {
            id: 2,
            stt: 2,
            code: "0102580015",
            customerName: "Nguyễn Văn Vũ",
            phone: "0913090736",
            address: "Thửa 343 ngách 31/294, Đường Kênh, Phường Nam Định, TP. Nam Định",
            registrationDate: "06/08/2025",
            surveyAppointment: "07/08/2025",
        },
    ];

    // Mock data for table 3
    const waitingInputData = [
        {
            id: 1,
            stt: 1,
            code: "0102404119",
            customerName: "Trần Liên Hương",
            phone: "0944808979",
            address: "28/107, Đường 19/5, P.Trần Tế Xương, TP. Nam Định",
            registrationDate: "24/04/2024",
            surveyAppointment: "24/04/2024",
            status: "pending_restore", // Chờ khôi phục
        },
        {
            id: 2,
            stt: 2,
            code: "0102590069",
            customerName: "Công ty CP Đầu tư và Thương mại Mạnh Hải",
            phone: "0906519568",
            address: "Số 96, Đông A, P.Lộc Vượng, TP. Nam Định",
            registrationDate: "26/09/2022",
            surveyAppointment: "26/09/2022",
            status: "rejected", // Từ chối
        },
        {
            id: 3,
            stt: 3,
            code: "1541155454",
            customerName: "Trần Văn Kiên",
            phone: "0944808979",
            address: "207, Đường 19, P.Bạch Đằng, TP. Nam Định",
            registrationDate: "27/04/2024",
            surveyAppointment: "28/04/2024",
            status: "none", // Không có
        },
    ];

    return (
        <>
            <CustomBreadcrumb items={[
                { label: "Trang chủ", href: "/home" },
                { label: "Khảo sát thiết kế", href: "#" },
                { label: "Xử lý đơn chờ thiết kế & Thiết kế", href: "/design-processing" },
            ]} />

            <div className="space-y-6 pt-2">
                <FilterSection />

                <div className="space-y-8">
                    <OrdersToDesignTable data={ordersToDesignData} />
                    <ProcessedDesignsTable data={processedDesignsData} />
                    <WaitingInputTable data={waitingInputData} />
                </div>
            </div>
        </>
    );
};

export default DesignProcessingPage;
