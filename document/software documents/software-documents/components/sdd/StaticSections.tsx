
'use client';

import React from 'react';
import { sddPrimitives } from './sddPrimitives';
import { RichTextEditor } from '../srs/RichTextEditor';

export const Section1_Introduction = () => {
    return (
        <div className="mb-8">
            <h2 className={sddPrimitives.h2}>1 Introduction</h2>

            <h3 className={sddPrimitives.h3}>1.1 Purpose</h3>
            <RichTextEditor initialContent="Identify the purpose of this Software Design Document..." simple />

            <h3 className={sddPrimitives.h3}>1.2 Definitions, Acronyms and Abbreviations</h3>
            <RichTextEditor initialContent="Provide definitions of all terms, acronyms, and abbreviations..." simple />

            <h3 className={sddPrimitives.h3}>1.3 References</h3>
            <RichTextEditor initialContent="List any other documents or Web addresses to which this document refers..." simple />
        </div>
    );
};

export const Section2_SystemArchitecture = () => {
    return (
        <div className="mb-8">
            <h2 className={sddPrimitives.h2}>2 System Architecture</h2>

            <h3 className={sddPrimitives.h3}>2.1 System Overview</h3>
            <RichTextEditor initialContent="Provide a brief description of the system software architecture..." simple />

            <h3 className={sddPrimitives.h3}>2.3 Assumptions</h3>
            <RichTextEditor initialContent="State any assumptions..." simple />

            <h3 className={sddPrimitives.h3}>2.4 Design Constraints</h3>
            <RichTextEditor initialContent="State any design constraints..." simple />
        </div>
    );
};
