import Header from '@/components/layout/Header'
import { siteConfig } from '@/config/site'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex flex-col bg-black-50">
            <Header menuItems={siteConfig.navItems} userName="Dung" />
            <div className="flex-1 overflow-y-auto flex flex-col">
                <div className="min-h-screen bg-[#f8f9fa]">
                    <main className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}

export default layout