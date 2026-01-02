
'use client';

import React from 'react';
import { srsPrimitives } from '../primitives';
import { ImageUploader } from './ImageUploader';

export const CoverPage = () => {
    return (
        <div className={`text-center bg-white text-[#2c3e50] ${srsPrimitives.font} min-h-[90vh] flex flex-col justify-center items-center`}>
            <div className="flex justify-center mb-8">
                <ImageUploader
                    initialSrc="/logo_fpt.png"
                    className="max-w-[200px]"
                    placeholder="Click to upload/change Logo"
                />
            </div>

            <h3
                className="mt-[1.4em] text-2xl font-bold min-w-[200px] outline-none border-b border-transparent hover:border-gray-300 focus:border-blue-500 transition-colors"
                contentEditable
                suppressContentEditableWarning
            >
                Project Name
            </h3>
            <h2 className={srsPrimitives.coverTitle}>
                Software Requirement Specification (SRS)
            </h2>
            <div className="my-4 text-md">
                <p>
                    <strong>Project Code: </strong>
                    <span className="outline-none border-b border-transparent hover:border-gray-300 focus:border-blue-500" contentEditable suppressContentEditableWarning>1.0</span>
                </p>
            </div>
        </div>
    );
};
