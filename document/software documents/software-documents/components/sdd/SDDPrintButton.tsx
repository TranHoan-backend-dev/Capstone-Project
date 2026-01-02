
'use client';

import React, { useEffect, useState } from 'react';
import { Button } from "@heroui/button";
import { useSDD } from './SDDContext';

export const SDDPrintButton = () => {
    const [isMounted, setIsMounted] = useState(false);
    const { resetData } = useSDD();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed bottom-5 right-5 z-50 print:hidden flex flex-col gap-3">
            <Button
                onPress={resetData}
                className="bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg rounded-full h-14 w-14 min-w-14 px-0 flex items-center justify-center p-0"
                title="Reset to Template"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
            </Button>

            <Button
                onPress={handlePrint}
                className="bg-[#c00000] hover:bg-red-800 text-white font-bold shadow-lg rounded-full h-14 w-14 min-w-14 px-0 flex items-center justify-center p-0"
                title="Print / Save PDF"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                </svg>
            </Button>
        </div>
    );
};
