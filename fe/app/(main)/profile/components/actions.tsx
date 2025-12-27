'use client'

import { BellIcon, DocumentTextIcon, PrinterIcon } from '@heroicons/react/24/solid'
import { Button } from '@heroui/react'
import Link from 'next/link'
import React from 'react'

const Actions = () => {
    return (
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
                href="#"
                as={Link}
                color="primary"
                className="h-12 px-8 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100"
                startContent={<DocumentTextIcon className="w-5 h-5" />}
            >
                Tạo hóa đơn
            </Button>
            <Button
                href="#"
                as={Link}
                variant="flat"
                className="h-12 px-8 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200"
                startContent={<PrinterIcon className="w-5 h-5" />}
            >
                In hóa đơn
            </Button>
            <Button
                href="#"
                as={Link}
                variant="flat"
                className="h-12 px-8 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200"
                startContent={<BellIcon className="w-5 h-5" />}
            >
                Gửi thông báo
            </Button>
        </div>
    )
}

export default Actions