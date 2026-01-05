"use client"

import { GenericSearchFilter } from '@/components/ui/GenericSearchFilter';
import { DocumentPlusIcon } from '@heroicons/react/24/solid';
import { AddressContactSection } from './components/address-contact-section';
import { BillingInfoSection } from './components/billing-info-section';
import { CustomerInfoSection } from './components/customer-info-section';
import { FormActions } from './components/form-actions';
import { OrderInfoSection } from './components/order-info-section';
import { RelatedOrdersTable } from './components/related-orders-table';

const NewInstallationForm = () => {
    const relatedOrders = [
        {
            id: "1",
            code: "01025070073",
            contractNo: "VXU3348",
            customerName: "Bùi Thị Hồng Oanh",
            address: "7/74 Vị Xuyên, TP. Nam Định",
            constructionDate: "20/07/2025",
            status: "completed",
        },
    ];

    return (
        <>
            <GenericSearchFilter
                title="Đơn lắp đặt mới"
                icon={<DocumentPlusIcon className="w-6 h-6" />}
                isCollapsible
                /* Cập nhật grid để các section xếp chồng hợp lý */
                gridClassName="flex flex-col gap-6"
                actions={<FormActions />}
            >
                {/* Các section thông tin chính */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <OrderInfoSection />
                    <CustomerInfoSection />
                    <AddressContactSection />
                </div>

                {/* Phần thông tin hóa đơn nằm dưới các section trên */}
                <BillingInfoSection />
            </GenericSearchFilter>

            {/* Bảng danh sách hồ sơ phía dưới */}
            <div className="mt-8">
                <RelatedOrdersTable data={relatedOrders} />
            </div>
        </>
    )
}

export default NewInstallationForm;