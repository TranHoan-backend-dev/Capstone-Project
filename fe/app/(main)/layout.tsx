import Header from '@/components/layout/Header'
import { siteConfig } from '@/config/site'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex flex-col bg-black-50">
            <Header menuItems={siteConfig.navItems} userName="Dung" />
            <main className="flex-1 overflow-y-auto flex flex-col">
                {children}
            </main>
        </div>
    )
}

export default layout