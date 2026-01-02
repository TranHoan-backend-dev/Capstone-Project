
'use client';

import React from 'react';
import { SDDProvider } from '../../components/sdd/SDDContext';
import { DocumentCoverPage } from '../../components/common/DocumentCoverPage'; // Unified Cover
import { RecordOfChanges } from '../../components/common/RecordOfChanges'; // Unified ROC
import { SDD_TableOfContents } from '../../components/sdd/SDD_TableOfContents';
import { Section1_Introduction, Section2_SystemArchitecture } from '../../components/sdd/StaticSections';
import { Section3_SoftwareArchitecture } from '../../components/sdd/Section3_Architecture';
import { Section4_DetailedDesign } from '../../components/sdd/Section4_DetailedDesign';
import { Section5_Database } from '../../components/sdd/Section5_Database';
import { SDDPrintButton } from '../../components/sdd/SDDPrintButton';
import { sddPrimitives } from '../../components/sdd/sddPrimitives';

export default function SDDPage() {
    return (
        <SDDProvider>
            <div className={`sdd-wrapper bg-[#fdfdfd] text-[#1a1a1a]`}>
                <SDDPrintButton />

                <div className={`min-h-screen print:bg-white print:text-black`}>
                    <div className="mx-auto max-w-[48em] p-8 hyphens-auto break-words text-rendering-optimizeLegibility font-kerning-normal max-sm:text-[0.9em] max-sm:p-3 print:bg-transparent print:max-w-none print:p-0 print:m-0">
                        {/* Page 1: Cover (Unified Template via Props) */}
                        <DocumentCoverPage
                            title="Software Design Document"
                            subtitle="Quiz Practice System"
                            showSubtitle={true}
                            projectCodeDefault="QPS"
                            docCodeDefault="QPS-v1"
                        />
                        <div className={sddPrimitives.pageBreak} />

                        {/* Page 2: TOC */}
                        <SDD_TableOfContents />
                        <div className={sddPrimitives.pageBreak} />

                        {/* Record of Changes (Added to match SRS template) */}
                        <RecordOfChanges />
                        <div className="mt-8" />

                        {/* Main Content */}
                        <div className="mt-8 font-[Segoe UI,Tahoma,Geneva,Verdana,sans-serif]">
                            <Section1_Introduction />
                            <Section2_SystemArchitecture />
                            <Section3_SoftwareArchitecture />
                            <Section4_DetailedDesign />
                            <Section5_Database />
                        </div>
                    </div>
                </div>
            </div>
        </SDDProvider>
    );
}
