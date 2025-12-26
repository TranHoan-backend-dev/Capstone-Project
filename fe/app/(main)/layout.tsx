import Header from '@/components/layout/header'
import { siteConfig } from '@/config/site'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex flex-col bg-black-50">
            <Header menuItems={siteConfig.navItems} userName="Dung" />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}

export default layout