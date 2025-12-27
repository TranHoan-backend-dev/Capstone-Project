'use client'

import { Card, CardBody } from '@heroui/react'
import React from 'react'

const PaymentDetails = () => {
    return (
        <Card shadow="sm" className="border-none rounded-2xl overflow-hidden bg-white">
            <CardBody className="p-0">
                <div className="p-8 border-b border-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Số Tiền Thanh Toán</h2>
                    <p className="text-sm font-medium text-gray-400 mt-1">(Tháng Này)</p>
                </div>
                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-50">
                    <div className="flex-1 p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-500">Đơn giá / m³</span>
                                <span className="text-sm font-bold text-gray-800 tracking-tight">15,500 VND</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-500">Số m³ tiêu thụ</span>
                                <span className="text-sm font-bold text-gray-800 tracking-tight">33 m³</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-500">Tạm tính</span>
                                <span className="text-sm font-bold text-gray-800 tracking-tight">511,500 VND</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-500">Thuế & phí</span>
                                <span className="text-sm font-bold text-gray-800 tracking-tight">51,150 VND</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 p-8 bg-blue-50/30 flex flex-col items-center justify-center space-y-3">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tổng thanh toán</p>
                        <div className="text-center">
                            <p className="text-5xl font-black text-blue-600 mb-1 tracking-tighter">562,650</p>
                            <p className="text-sm font-bold text-blue-400 uppercase tracking-widest">VND</p>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}

export default PaymentDetails