
'use client';

import React from 'react';
import { srsPrimitives } from '../primitives';
import { useSRS } from './SRSContext';

export const TableOfContents = () => {
    const { features } = useSRS();

    return (
        <div id="table-of-contents" className="min-h-[90vh] flex flex-col justify-center">
            <h2 className={`${srsPrimitives.tocTitle} text-center`}>
                Table of Contents
            </h2>
            <div className="toc-content text-sm max-w-[80%] mx-auto w-full">
                <div className="flex justify-between font-bold border-b border-black mb-2 pb-1">
                    <span>Content</span>
                    <span>Page</span>
                </div>

                {/* Static TOC items */}
                <TOCItem label="I. Record of changes" page="3" bold />
                <TOCItem label="II. Software Requirement Specification" page="3" bold />
                <TOCItem label="1. Product Overview" page="3" indent={1} />
                <TOCItem label="2. User Requirements" page="3" indent={1} />
                <TOCItem label="2.1 Actors" page="3" indent={2} />
                <TOCItem label="2.2 Use Cases" page="4" indent={2} />
                <TOCItem label="3. Software Features" page="5" indent={1} />
                <TOCItem label="3.1 Functional Overview" page="5" indent={2} />

                {/* Dynamic Features from Context */}
                {features.map((feature, fIdx) => {
                    const featureNum = `3.${fIdx + 2}`;
                    // Extract plain text from rich text if needed, effectively simpler here just using string for now
                    // Assuming user enters plain text for titles essentially or we strip HTML
                    const simpleTitle = feature.headerTitle.replace(/<[^>]*>?/gm, '');

                    return (
                        <React.Fragment key={feature.id}>
                            <TOCItem label={`${featureNum} ${simpleTitle}`} page={`${6 + fIdx}`} indent={2} />
                            {feature.useCases.map((uc, uIdx) => {
                                const ucNum = `${featureNum}.${uIdx + 1}`;
                                return (
                                    <TOCItem key={uc.id} label={`${ucNum} ${uc.useCaseName}`} page="..." indent={3} />
                                );
                            })}
                        </React.Fragment>
                    )
                })}

                <TOCItem label="4. Non-Functional Requirements" page="..." indent={1} />
                <TOCItem label="5. Requirement Appendix" page="..." indent={1} />
            </div>
        </div>
    );
};

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
