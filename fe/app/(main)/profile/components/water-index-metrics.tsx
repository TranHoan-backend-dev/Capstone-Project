'use client'

import { DocumentTextIcon } from '@heroicons/react/24/solid'
import { Card, CardBody } from '@heroui/react'
import React from 'react'

const WaterIndexMetrics = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
                { label: "Chỉ số kỳ trước", value: "1,245", unit: "m³" },
                { label: "Chỉ số kỳ này", value: "1,278", unit: "m³" },
                { label: "Tiêu thụ", value: "33", unit: "m³", isHighlight: true },
            ].map((item, idx) => (
                <Card key={idx} shadow="sm" className="border-none rounded-2xl bg-white">
                    <CardBody className="p-8 flex flex-col items-center justify-center space-y-3 relative group overflow-hidden">
                        <div className={`absolute top-0 right-0 p-3 opacity-10 transition-transform group-hover:scale-110`}>
                            <DocumentTextIcon className="w-12 h-12 text-blue-600" />
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                        <div className="flex items-baseline gap-1">
                            <span className={`text-4xl font-black ${item.isHighlight ? "text-blue-600" : "text-gray-800"}`}>
                                {item.value}
                            </span>
                            <span className="text-sm font-bold text-gray-400">{item.unit}</span>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    )
}

export default WaterIndexMetrics