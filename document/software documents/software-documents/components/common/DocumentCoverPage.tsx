
'use client';

import React from 'react';
import { srsPrimitives } from '../primitives';
import { ImageUploader } from '../srs/ImageUploader';

interface DocumentCoverPageProps {
    title: string;
    showSubtitle?: boolean;
    subtitle?: string;
    projectCodeDefault?: string;
    docCodeDefault?: string;
}

export const DocumentCoverPage: React.FC<DocumentCoverPageProps> = ({
    title,
    showSubtitle = false,
    subtitle = '',
    projectCodeDefault = '1.0',
    docCodeDefault = ''
}) => {
    return (
        <div className={`text-center bg-white text-[#2c3e50] ${srsPrimitives.font} min-h-[90vh] flex flex-col justify-center items-center`}>
            <div className="flex justify-center mb-8">
                <ImageUploader
                    initialSrc="/logo_fpt.png"
                    className="max-w-[200px]"
                    placeholder="Click to upload/change Logo"
                />
            </div>

            {showSubtitle && (
                <h1 className="text-3xl font-bold mb-4 outline-none border-b border-transparent hover:border-gray-300 focus:border-blue-500 transition-colors" contentEditable suppressContentEditableWarning>
                    {subtitle}
                </h1>
            )}

            {/* Main Title - e.g. Software Requirement Specs */}
            <h2 className={`${srsPrimitives.coverTitle} text-[#c00000] text-4xl mb-12`}>
                {title}
            </h2>

            <div className="my-4 text-md font-bold">
                <div className="mb-2 flex gap-2 justify-center">
                    <strong>Project Code: </strong>
                    <span className="outline-none border-b border-transparent hover:border-gray-300 focus:border-blue-500" contentEditable suppressContentEditableWarning>
                        {projectCodeDefault}
                    </span>
                </div>
                {docCodeDefault && (
                    <div className="flex gap-2 justify-center">
                        <strong>Document Code: </strong>
                        <span className="outline-none border-b border-transparent hover:border-gray-300 focus:border-blue-500" contentEditable suppressContentEditableWarning>
                            {docCodeDefault}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
