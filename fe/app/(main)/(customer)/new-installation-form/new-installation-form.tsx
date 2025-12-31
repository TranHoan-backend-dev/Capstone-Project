"use client"

import { GenericSearchFilter } from '@/components/ui/GenericSearchFilter'
import { DocumentPlusIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { FormActions } from './components/form-actions'
import { OrderInfoSection } from './components/order-info-section'
import { CustomerInfoSection } from './components/customer-info-section'
import { AddressContactSection } from './components/address-contact-section'
import { RelatedOrdersTable } from './components/related-orders-table'

const NewInstallationForm = () => {
    const relatedOrders = [
        {
            id: "1",
            code: "DH001235",
            customerName: "Trần Thị B",
            phone: "0987654321",
            address: "123 Nguyễn Văn Cừ, Q1",
            createdDate: "15/12/2024",
            status: "completed",
        },
        {
            id: "2",
            code: "DH001236",
            customerName: "Lê Văn C",
            phone: "0912345678",
            address: "456 Lê Lợi, Q3",
            createdDate: "14/12/2024",
            status: "installing",
        },
    ];

    return (
        <>
            <GenericSearchFilter
                title="Đơn lắp đặt mới"
                icon={<DocumentPlusIcon className="w-6 h-6" />}
                isCollapsible
                gridClassName="grid grid-cols-1 lg:grid-cols-3 gap-12"
                actions={<FormActions />}
            >
                <OrderInfoSection />
                <CustomerInfoSection />
                <AddressContactSection />
            </GenericSearchFilter>

            <RelatedOrdersTable data={relatedOrders} />
        </>
    )
}

export default NewInstallationForm;