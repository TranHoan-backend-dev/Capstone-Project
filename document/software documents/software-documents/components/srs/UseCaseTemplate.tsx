
'use client';

import React, { useState } from 'react';
import { srsPrimitives } from '../primitives';
import { ImageUploader } from './ImageUploader';
import { RichTextEditor } from './RichTextEditor';
import { Button } from "@heroui/button";

interface UseCaseTemplateProps {
    ucNumber: string; // e.g. "3.2.1"
    fid: string;
    functionName: string;
    ucId: string;
    useCaseName: string;
    tableNumber: number; // Global table number
    figureNumber: number; // Global figure number
}

// Helper interface for Alternative Flow data structure
interface AltFlowStep {
    subStep: string;
    actor: string;
    action: string;
}

interface AltFlowGroup {
    id: string; // e.g. AT1
    steps: AltFlowStep[];
}

const UseCaseTemplate: React.FC<UseCaseTemplateProps> = ({
    ucNumber,
    fid,
    functionName,
    ucId,
    useCaseName,
    tableNumber,
    figureNumber
}) => {
    // State for main flow steps
    const [mainFlowSteps, setMainFlowSteps] = useState([
        { step: '1', actor: 'User', action: 'User selects "Login" button.' },
        { step: '2', actor: 'System', action: 'System displays Login screen.' }
    ]);

    // Redesigned Alternative Flow State: List of Groups (AT1, AT2), each has Steps.
    const [altFlowGroups, setAltFlowGroups] = useState<AltFlowGroup[]>([
        {
            id: 'AT1',
            steps: [
                { subStep: '1', actor: 'User', action: 'User enters invalid credentials.' }
            ]
        }
    ]);

    // State for business rules in this UC
    const [rules, setRules] = useState([
        { id: 'BR-01', description: 'Rule description here' }
    ]);

    // State for screen definition table rows
    const [screenDefinitions, setScreenDefinitions] = useState([
        { field: '', type: '', mandatory: '', maxLen: '', desc: '' }
    ]);

    // --- Actions ---

    const addMainStep = () => {
        setMainFlowSteps([...mainFlowSteps, { step: (mainFlowSteps.length + 1).toString(), actor: '', action: '' }]);
    };
    const removeMainStep = (idx: number) => {
        const newSteps = [...mainFlowSteps];
        newSteps.splice(idx, 1);
        setMainFlowSteps(newSteps);
    };

    // Add a NEW Alternative Flow Group (e.g. AT2)
    const addAltFlowGroup = () => {
        setAltFlowGroups([...altFlowGroups, {
            id: 'AT' + (altFlowGroups.length + 1),
            steps: [{ subStep: '1', actor: '', action: '' }]
        }]);
    };

    // Remove an existing Alt Flow Group
    const removeAltFlowGroup = (groupIdx: number) => {
        if (confirm('Delete this entire Alternative Flow sequence?')) {
            const newGroups = [...altFlowGroups];
            newGroups.splice(groupIdx, 1);
            setAltFlowGroups(newGroups);
        }
    };

    // Add a step to a specific Alt Flow Group
    const addAltFlowStep = (groupIdx: number) => {
        const newGroups = [...altFlowGroups];
        const group = newGroups[groupIdx];
        group.steps.push({
            subStep: (group.steps.length + 1).toString(),
            actor: '',
            action: ''
        });
        setAltFlowGroups(newGroups);
    };

    // Remove a step from a specific Alt Flow Group
    const removeAltFlowStep = (groupIdx: number, stepIdx: number) => {
        const newGroups = [...altFlowGroups];
        newGroups[groupIdx].steps.splice(stepIdx, 1);
        setAltFlowGroups(newGroups);
    };

    const addRule = () => {
        setRules([...rules, { id: 'BR-0' + (rules.length + 1), description: '' }]);
    };
    const removeRule = (idx: number) => {
        const newRules = [...rules];
        newRules.splice(idx, 1);
        setRules(newRules);
    };

    const addScreenDef = () => {
        setScreenDefinitions([...screenDefinitions, { field: '', type: '', mandatory: '', maxLen: '', desc: '' }]);
    };
    const removeScreenDef = (idx: number) => {
        const newDefs = [...screenDefinitions];
        newDefs.splice(idx, 1);
        setScreenDefinitions(newDefs);
    };

    return (
        <div className="usecase-template">
            <h3 id={`uc-${ucId}`} className="text-[#365F91] font-[Segoe UI,Tahoma,Geneva,Verdana,sans-serif] text-lg font-bold mt-2">
                {ucNumber} <RichTextEditor initialContent={`<<${fid} - ${functionName} / ${ucId} ${useCaseName}>>`} simple className="inline-block" />
            </h3>

            <h4 className="text-blue-700 italic font-[Segoe UI,Tahoma,Geneva,Verdana,sans-serif] font-bold mt-[1.4em]">
                {ucNumber}.1 Screen Mock-up
            </h4>

            <div className="my-4 flex flex-col items-center justify-center">
                <ImageUploader placeholder="Click to upload Screen Mockup" />
                <p className="mt-2 text-center text-sm italic">
                    <strong>Figure 3.{figureNumber}: </strong>
                    <RichTextEditor initialContent="<< Screen Mockup Description >>" simple className="inline-block" />
                </p>
            </div>

            <p className="my-4"><strong>Table 3-{tableNumber}: Screen Definition</strong></p>

            <div className="relative group/table">
                <table className={srsPrimitives.table}>
                    <thead>
                        <tr>
                            <th className={`${srsPrimitives.th} text-center`}>#</th>
                            <th className={`${srsPrimitives.th} text-left`}>Field Name</th>
                            <th className={`${srsPrimitives.th} text-left`}>Type</th>
                            <th className={`${srsPrimitives.th} text-left`}>Mandatory</th>
                            <th className={`${srsPrimitives.th} text-left`}>Max Length</th>
                            <th className={`${srsPrimitives.th} text-left`}>Description</th>
                            <th className="print:hidden w-8 border-0"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {screenDefinitions.map((row, idx) => (
                            <tr key={idx} className="group/row">
                                <td className={`${srsPrimitives.td} text-center`}>{idx + 1}</td>
                                <td className={`${srsPrimitives.td}`}><RichTextEditor initialContent={row.field} simple /></td>
                                <td className={`${srsPrimitives.td}`}><RichTextEditor initialContent={row.type} simple /></td>
                                <td className={`${srsPrimitives.td}`}><RichTextEditor initialContent={row.mandatory} simple /></td>
                                <td className={`${srsPrimitives.td}`}><RichTextEditor initialContent={row.maxLen} simple /></td>
                                <td className={`${srsPrimitives.td}`}><RichTextEditor initialContent={row.desc} simple /></td>
                                <td className="print:hidden border-0 p-0 text-center align-middle">
                                    <button onClick={() => removeScreenDef(idx)} className="text-red-500 font-bold opacity-0 group-hover/row:opacity-100 transition-opacity px-2">X</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="print:hidden my-2">
                    <Button size="sm" variant="light" color="primary" onPress={addScreenDef}>+ Add Field</Button>
                </div>
            </div>

            <h4 className="text-blue-700 italic font-[Segoe UI,Tahoma,Geneva,Verdana,sans-serif] font-bold mt-[1.4em]">
                {ucNumber}.2 Use Case Description
            </h4>

            <table className={`${srsPrimitives.table} font-[Segoe UI,Tahoma,Geneva,Verdana,sans-serif]`}>
                <tbody>
                    <tr>
                        <td className="border border-[#1a1a1a] p-[5px] font-bold bg-[#FDE9D9]">Use Case ID</td>
                        <td className="border border-[#1a1a1a] p-[5px] font-bold"><RichTextEditor initialContent={ucId} simple /></td>
                        <td className="border border-[#1a1a1a] p-[5px] font-bold bg-[#FDE9D9]">Use Case Name</td>
                        <td colSpan={3} className="border border-[#1a1a1a] p-[5px] font-bold"><RichTextEditor initialContent={useCaseName} simple /></td>
                    </tr>
                    <tr>
                        <td className="border border-[#1a1a1a] p-[5px] font-bold bg-[#FDE9D9]">Author</td>
                        <td className="border border-[#1a1a1a] p-[5px] font-bold"><RichTextEditor simple /></td>
                        <td className="border border-[#1a1a1a] p-[5px] font-bold bg-[#FDE9D9]">Version</td>
                        <td className="border border-[#1a1a1a] p-[5px] font-bold"><RichTextEditor simple /></td>
                        <td className="border border-[#1a1a1a] p-[5px] font-bold bg-[#FDE9D9]">Date</td>
                        <td className="border border-[#1a1a1a] p-[5px] font-bold"><RichTextEditor simple /></td>
                    </tr>
                    <tr>
                        <td className="border border-[#1a1a1a] p-[5px] font-bold bg-[#FDE9D9]">Actor</td>
                        <td colSpan={5} className="border border-[#1a1a1a] p-[5px]"><RichTextEditor simple /></td>
                    </tr>
                    <tr>
                        <td className="border border-[#1a1a1a] p-[5px] font-bold bg-[#FDE9D9]">Description</td>
                        <td colSpan={5} className="border border-[#1a1a1a] p-[5px]"><RichTextEditor simple /></td>
                    </tr>
                    <tr>
                        <td className="border border-[#1a1a1a] p-[5px] font-bold bg-[#FDE9D9]">Precondition</td>
                        <td colSpan={5} className="border border-[#1a1a1a] p-[5px]"><RichTextEditor simple /></td>
                    </tr>
                    <tr>
                        <td className="border border-[#1a1a1a] p-[5px] font-bold bg-[#FDE9D9]">Trigger</td>
                        <td colSpan={5} className="border border-[#1a1a1a] p-[5px]"><RichTextEditor simple /></td>
                    </tr>
                    <tr>
                        <td className="border border-[#1a1a1a] p-[5px] font-bold bg-[#FDE9D9]">Post-Condition</td>
                        <td colSpan={5} className="border border-[#1a1a1a] p-[5px]"><RichTextEditor simple /></td>
                    </tr>
                    <tr className="bg-[#FDE9D9]">
                        <td colSpan={6} className="border border-[#1a1a1a] p-[5px] font-bold">Main flows</td>
                    </tr>
                    <tr className="bg-[#FDE9D9]">
                        <td className="border border-[#1a1a1a] p-[5px] font-bold italic">Step</td>
                        <td className="border border-[#1a1a1a] p-[5px] font-bold italic">Actor</td>
                        <td colSpan={4} className="border border-[#1a1a1a] p-[5px] font-bold italic">Action</td>
                    </tr>
                    {mainFlowSteps.map((step, idx) => (
                        <tr key={`main-${idx}`} className="group/row">
                            <td className="border border-[#1a1a1a] p-[5px] italic relative">
                                <RichTextEditor initialContent={step.step} simple />
                                <button onClick={() => removeMainStep(idx)} className="print:hidden absolute top-0 right-0 text-red-500 font-bold opacity-0 group-hover/row:opacity-100 px-1">x</button>
                            </td>
                            <td className="border border-[#1a1a1a] p-[5px]"><RichTextEditor initialContent={step.actor} simple /></td>
                            <td colSpan={4} className="border border-[#1a1a1a] p-[5px]"><RichTextEditor initialContent={step.action} simple /></td>
                        </tr>
                    ))}
                    <tr className="print:hidden">
                        <td colSpan={6} className="p-2 text-center border border-dashed border-gray-300">
                            <Button size="sm" variant="light" color="primary" onPress={addMainStep}>+ Add Step</Button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="my-4" />

            <div className="flex justify-between items-baseline my-4 print:hidden">
                <p><strong>Alternative flows</strong></p>
                <Button size="sm" variant="light" color="primary" onPress={addAltFlowGroup}>+ Add New Flow (e.g. AT2)</Button>
            </div>
            <p className="print:block hidden my-4"><strong>Alternative flows</strong></p>

            <table className={`${srsPrimitives.table} font-[Segoe UI,Tahoma,Geneva,Verdana,sans-serif]`}>
                <tbody>
                    {altFlowGroups.map((group, groupIdx) => (
                        <React.Fragment key={`group-${groupIdx}`}>
                            {/* Spacer Row between groups (only if not the first group) */}
                            {groupIdx > 0 && (
                                <tr className="h-4 border-0">
                                    <td colSpan={3} className="border-0 bg-white"></td>
                                </tr>
                            )}

                            <tr className="group/header">
                                <td className="border border-[#1a1a1a] p-[5px] font-bold w-[10%] relative bg-gray-50">
                                    <RichTextEditor initialContent={group.id} simple />
                                    <button onClick={() => removeAltFlowGroup(groupIdx)} className="print:hidden absolute top-0 right-0 text-red-500 font-bold opacity-0 group-hover/header:opacity-100 px-1">X</button>
                                </td>
                                <td colSpan={2} className="border border-[#1a1a1a] p-[5px] bg-gray-50">
                                    <RichTextEditor placeholder="Description or Condition..." simple />
                                </td>
                            </tr>
                            <tr className="bg-[#FDE9D9]">
                                <td className="border border-[#1a1a1a] p-[5px] font-bold">Sub step</td>
                                <td className="border border-[#1a1a1a] p-[5px] font-bold">Actor</td>
                                <td className="border border-[#1a1a1a] p-[5px] font-bold">Action</td>
                            </tr>
                            {group.steps.map((step, stepIdx) => (
                                <tr key={`step-${groupIdx}-${stepIdx}`} className="group/row">
                                    <td className="border border-[#1a1a1a] p-[5px] relative">
                                        <RichTextEditor initialContent={step.subStep} simple />
                                        <button onClick={() => removeAltFlowStep(groupIdx, stepIdx)} className="print:hidden absolute top-0 right-0 text-red-500 font-bold opacity-0 group-hover/row:opacity-100 px-1">x</button>
                                    </td>
                                    <td className="border border-[#1a1a1a] p-[5px]"><RichTextEditor initialContent={step.actor} simple /></td>
                                    <td className="border border-[#1a1a1a] p-[5px]"><RichTextEditor initialContent={step.action} simple /></td>
                                </tr>
                            ))}
                            <tr className="print:hidden">
                                <td colSpan={3} className="p-1 text-center border border-dashed border-gray-300">
                                    <Button size="sm" variant="light" className="h-6 min-h-0" onPress={() => addAltFlowStep(groupIdx)}>+ Add Step to {group.id}</Button>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            <div className="my-4" />

            <p className="my-4"><strong><em>Business Rules</em></strong></p>

            <table className={`${srsPrimitives.table} font-[Segoe UI,Tahoma,Geneva,Verdana,sans-serif]`}>
                <tbody>
                    <tr className="bg-[#FDE9D9]">
                        <td className="border border-[#1a1a1a] p-[5px] font-bold w-[10%]">#</td>
                        <td className="border border-[#1a1a1a] p-[5px] font-bold">Rule Description</td>
                        <td className="border border-[#1a1a1a] p-[5px] font-bold w-8 print:hidden"></td>
                    </tr>
                    {rules.map((rule, idx) => (
                        <tr key={`rule-${idx}`} className="group/row">
                            <td className="border border-[#1a1a1a] p-[5px]"><RichTextEditor initialContent={rule.id} simple /></td>
                            <td className="border border-[#1a1a1a] p-[5px]"><RichTextEditor initialContent={rule.description} simple /></td>
                            <td className="border border-[#1a1a1a] p-[5px] text-center print:hidden border-0">
                                <button onClick={() => removeRule(idx)} className="text-red-500 font-bold opacity-0 group-hover/row:opacity-100 transition-opacity">X</button>
                            </td>
                        </tr>
                    ))}
                    <tr className="print:hidden">
                        <td colSpan={3} className="p-2 text-center border border-dashed border-gray-300">
                            <Button size="sm" variant="light" color="primary" onPress={addRule}>+ Add Rule</Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default UseCaseTemplate;
