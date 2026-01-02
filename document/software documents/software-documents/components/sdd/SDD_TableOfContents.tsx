
'use client';

import React from 'react';
import { sddPrimitives } from './sddPrimitives';
import { useSDD } from './SDDContext';

// Reusable TOC Item matching SRS style
interface TOCItemProps {
    label: string;
    page: string;
    bold?: boolean;
    indent?: number;
}

const TOCItem: React.FC<TOCItemProps> = ({ label, page, bold = false, indent = 0 }) => (
    <div className={`flex justify-between items-baseline my-1 ${indent === 1 ? 'ml-4' : indent === 2 ? 'ml-8' : indent === 3 ? 'ml-12' : ''}`}>
        <span><span className={bold ? 'font-bold' : ''}>{label}</span></span>
        <span className="border-b border-dotted border-gray-400 flex-grow mx-2"></span>
        <span>{page}</span>
    </div>
);

export const SDD_TableOfContents = () => {
    const { sddData } = useSDD();

    return (
        <div className="min-h-[90vh] flex flex-col justify-center font-[Segoe UI,Tahoma,Geneva,Verdana,sans-serif]">
            <h2 className={`${sddPrimitives.tocTitle}`}>
                Table of Contents
            </h2>

            <div className="toc-content text-sm max-w-[80%] mx-auto w-full">
                <div className="flex justify-between font-bold border-b border-black mb-2 pb-1">
                    <span>Content</span>
                    <span>Page</span>
                </div>

                {/* Static Items */}
                <TOCItem label="I. Record of changes" page="3" bold />
                <TOCItem label="II. Software Design Document" page="3" bold />

                <TOCItem label="1 Introduction" page="3" indent={0} bold />
                <TOCItem label="1.1 Purpose" page="3" indent={1} />
                <TOCItem label="1.2 Definitions, Acronyms and Abbreviations" page="3" indent={1} />
                <TOCItem label="1.3 References" page="3" indent={1} />

                <TOCItem label="2 System Architecture" page="3" indent={0} bold />
                <TOCItem label="2.1 System Overview" page="3" indent={1} />
                <TOCItem label="2.3 Assumptions" page="4" indent={1} />
                <TOCItem label="2.4 Design Constraints" page="4" indent={1} />

                <TOCItem label="3 Software Architecture Design" page="5" indent={0} bold />
                <TOCItem label="3.1 Architectural Representation" page="5" indent={1} />
                <TOCItem label="3.2 Software Architecture (Views)" page="5" indent={1} />

                <TOCItem label="4 Detailed Component Design" page="10" indent={0} bold />
                <TOCItem label="4.1 Common Design" page="10" indent={1} />

                {/* Dynamic Component Sections */}
                {sddData.components.map((comp, idx) => {
                    // Clean HTML from simple rich text fields if necessary
                    const ucId = comp.ucId ? comp.ucId.replace(/<[^>]*>?/gm, '') : '<ID>';
                    const name = comp.name ? comp.name.replace(/<[^>]*>?/gm, '') : '<Name>';
                    return (
                        <React.Fragment key={comp.id}>
                            <TOCItem label={`4.${idx + 2} ${ucId} - ${name}`} page="..." indent={1} />
                        </React.Fragment>
                    );
                })}

                <TOCItem label="5 Database Design" page="14" indent={0} bold />
                <TOCItem label="5.1 Database Design" page="14" indent={1} />
                <TOCItem label="5.2 Data File Design" page="15" indent={1} />
            </div>
        </div>
    );
};
