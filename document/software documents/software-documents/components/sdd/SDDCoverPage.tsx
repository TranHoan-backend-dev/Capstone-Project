
'use client';

import React from 'react';
import { srsPrimitives } from '../primitives';
import { ImageUploader } from '../srs/ImageUploader';
import { sddPrimitives } from './sddPrimitives'; // We will define this next

export const SDDCoverPage = () => {
    return (
        <div className={`text-center bg-white text-[#2c3e50] font-[Segoe UI,Tahoma,Geneva,Verdana,sans-serif] min-h-[90vh] flex flex-col justify-center items-center`}>
            <div className="flex justify-center mb-8">
                <ImageUploader
                    initialSrc="/logo_fpt.png"
                    className="max-w-[200px]"
                    placeholder="Click to upload/change Logo"
                />
            </div>

            <h1 className="text-3xl font-bold mb-4">
                Quiz Practice System
            </h1>

            <h2 className="text-[#c00000] text-4xl font-bold mb-12">
                Software Design Document
            </h2>

            <div className="my-4 text-md font-bold">
                <p className="mb-2">
                    Project Code: <span className="outline-none border-b border-transparent hover:border-gray-300 focus:border-blue-500" contentEditable suppressContentEditableWarning>QPS</span>
                </p>
                <p>
                    Document Code: <span className="outline-none border-b border-transparent hover:border-gray-300 focus:border-blue-500" contentEditable suppressContentEditableWarning>QPS-v1</span>
                </p>
            </div>
        </div>
    );
};
