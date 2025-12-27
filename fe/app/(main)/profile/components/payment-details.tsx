'use client'

import { Card, CardBody } from '@heroui/react'
import React from 'react'

const PaymentDetails = () => {
    return (
        <Card shadow="sm" className="border-none rounded-3xl bg-white">
            <CardBody className="p-10">
                <div className="flex flex-col lg:flex-row gap-16">
                    <div className="flex-1 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Số Tiền Thanh Toán</h2>
                            <p className="text-sm font-semibold text-slate-400 mt-1.5">(Tháng Này)</p>
                        </div>

                        <div className="divide-y divide-slate-100/80 border-t border-slate-50">
                            {[
                                { label: "Đơn giá / m³", value: "15,500 VND" },
                                { label: "Số m³ tiêu thụ", value: "33 m³" },
                                { label: "Tạm tính", value: "511,500 VND" },
                                { label: "Thuế & phí", value: "51,150 VND" },
                            ].map((item, idx) => (
                                <div key={idx} className="py-5 flex justify-between items-center group">
                                    <span className="text-sm font-medium text-slate-500 uppercase tracking-wide text-[12px]">{item.label}</span>
                                    <span className="text-sm font-bold text-slate-800 tracking-tight">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-[400px] flex flex-1 items-center">
                        <div className="w-full bg-[#f8fbff] border border-blue-50/50 rounded-3xl p-12 flex flex-col items-center justify-center space-y-6">
                            <p className="text-[11px] font-black uppercase tracking-[0.25em]">TỔNG THANH TOÁN</p>
                            <div className="text-center">
                                <p className="text-5xl md:text-4xl font-black text-slate-900 leading-none tracking-tighter">562,650</p>
                                <p className="text-[13px] font-black text-slate-400 uppercase tracking-[0.3em] mt-5">VND</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}

export default PaymentDetails