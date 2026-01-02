
'use client';

import React from 'react';

import { CoverPage } from '../../components/srs/CoverPage';
import { TableOfContents } from '../../components/srs/TableOfContents';
import { RecordOfChanges } from '../../components/srs/RecordOfChanges';
import { ProductOverview } from '../../components/srs/ProductOverview';
import { UserRequirements } from '../../components/srs/UserRequirements';
import { SoftwareFeatures } from '../../components/srs/SoftwareFeatures';
import { Appendices } from '../../components/srs/Appendices';
import { PrintButton } from '../../components/srs/PrintButton';
import { SRSProvider } from '../../components/srs/SRSContext';

import { srsPrimitives } from '../../components/primitives';

export default function SRSPage() {
    return (
        <SRSProvider>
            <div className={`srs-wrapper bg-[#fdfdfd] ${srsPrimitives.text} text-[#1a1a1a]`}>
                {/* Control Panel */}
                <PrintButton />

                <div className={`min-h-screen print:bg-white print:text-black`}>
                    <div className="mx-auto max-w-[48em] p-8 hyphens-auto break-words text-rendering-optimizeLegibility font-kerning-normal max-sm:text-[0.9em] max-sm:p-3 print:bg-transparent print:max-w-none print:p-0 print:m-0">
                        <div>
                            {/* Page 1: Cover */}
                            <CoverPage />
                            <div className={srsPrimitives.pageBreak} />

                            {/* Page 2: Table of Contents */}
                            <TableOfContents />
                            <div className={srsPrimitives.pageBreak} />

                            {/* Page 3+: Main Content */}
                            <RecordOfChanges />
                            <div className="my-8" />

                            <div id="srs">
                                <h2 className={srsPrimitives.h2}>
                                    II. Software Requirement Specification
                                </h2>
                            </div>

                            <ProductOverview />
                            <UserRequirements />
                            <SoftwareFeatures />

                            {/* Page N: Appendices */}
                            <Appendices />
                        </div>
                    </div>
                </div>
            </div>
        </SRSProvider>
    );
}
