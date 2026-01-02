
'use client';

import React from 'react';
import { sddPrimitives } from './sddPrimitives';
import { RichTextEditor } from '../srs/RichTextEditor';
import { Button } from "@heroui/button";
import { useSDD } from './SDDContext';

interface ClassDesignTableProps {
    classData: import('./SDDContext').ClassDesign;
    componentIndex: number;
    classIndex: number;
    onRemove?: () => void;
}

export const ClassDesignTable: React.FC<ClassDesignTableProps> = ({ classData, componentIndex, classIndex, onRemove }) => {
    const { sddData, setSDDData } = useSDD();

    const updateClassField = (field: string, value: any) => {
        const newData = { ...sddData };
        // @ts-ignore
        newData.components[componentIndex].classes[classIndex][field] = value;
        setSDDData(newData);
    };

    // Attributes Helpers
    const addAttribute = () => {
        const newData = { ...sddData };
        newData.components[componentIndex].classes[classIndex].attributes.push({ name: '', type: '', description: '' });
        setSDDData(newData);
    };

    const updateAttribute = (attrIdx: number, field: string, val: string) => {
        const newData = { ...sddData };
        // @ts-ignore
        newData.components[componentIndex].classes[classIndex].attributes[attrIdx][field] = val;
        setSDDData(newData);
    };

    const removeAttribute = (attrIdx: number) => {
        // Allow removing even if only 1, or keep 1? User said "Vẫn giữ các nút action như bình thường" so assume previous logic (keep 1) or standard add/remove. 
        // Previous logic was keep 1. Let's stick to that unless requested otherwise.
        if (sddData.components[componentIndex].classes[classIndex].attributes.length <= 1) return;
        const newData = { ...sddData };
        newData.components[componentIndex].classes[classIndex].attributes.splice(attrIdx, 1);
        setSDDData(newData);
    };

    // Methods Helpers
    const addMethod = () => {
        const newData = { ...sddData };
        newData.components[componentIndex].classes[classIndex].methods.push({ name: '', input: '', output: '', description: '' });
        setSDDData(newData);
    };
    const updateMethod = (methIdx: number, field: string, val: string) => {
        const newData = { ...sddData };
        // @ts-ignore
        newData.components[componentIndex].classes[classIndex].methods[methIdx][field] = val;
        setSDDData(newData);
    };

    const removeMethod = (methIdx: number) => {
        if (sddData.components[componentIndex].classes[classIndex].methods.length <= 1) return;
        const newData = { ...sddData };
        newData.components[componentIndex].classes[classIndex].methods.splice(methIdx, 1);
        setSDDData(newData);
    };

    return (
        <div className="mb-8 font-[Segoe UI,Tahoma,Geneva,Verdana,sans-serif] relative group/table">
            <div className="flex justify-between items-center my-2">
                <h5 className="text-sm font-bold text-blue-800">4.{componentIndex + 2}.2.2.{classIndex + 1} {classData.className} Class</h5>
                {onRemove && (
                    <Button
                        size="sm"
                        color="danger"
                        variant="light"
                        onPress={onRemove}
                        className="print:hidden opacity-0 group-hover/table:opacity-100 transition-opacity"
                    >
                        Delete Class
                    </Button>
                )}
            </div>

            <table className={`${sddPrimitives.table} border-2 border-black`}>
                <tbody>
                    <tr>
                        <td className="w-1/4 font-bold bg-[#FDE9D9] p-2 border border-black">Class</td>
                        <td colSpan={2} className="p-2 border border-black">
                            <RichTextEditor initialContent={classData.className} onChange={(v) => updateClassField('className', v)} simple />
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold p-2 border border-black">Description</td>
                        <td colSpan={2} className="p-2 border border-black">
                            <RichTextEditor initialContent={classData.description} onChange={(v) => updateClassField('description', v)} simple />
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold p-2 border border-black">Base Class</td>
                        <td colSpan={2} className="p-2 border border-black">
                            <RichTextEditor initialContent={classData.baseClass} onChange={(v) => updateClassField('baseClass', v)} simple />
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold p-2 border border-black">Constructor</td>
                        <td colSpan={2} className="p-2 border border-black">
                            <RichTextEditor initialContent={classData.constructor} onChange={(v) => updateClassField('constructor', v)} simple />
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold p-2 border border-black">Prototype</td>
                        <td colSpan={2} className="p-2 border border-black">
                            <RichTextEditor initialContent={classData.prototype} onChange={(v) => updateClassField('prototype', v)} simple />
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold p-2 border border-black">Source File</td>
                        <td colSpan={2} className="p-2 border border-black">
                            <RichTextEditor initialContent={classData.sourceFile} onChange={(v) => updateClassField('sourceFile', v)} simple />
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold p-2 border border-black">Namespace</td>
                        <td colSpan={2} className="p-2 border border-black">
                            <RichTextEditor initialContent={classData.namespace} onChange={(v) => updateClassField('namespace', v)} simple />
                        </td>
                    </tr>

                    {/* Attributes Section - Refactored based on image */}
                    {/* The image shows:
                        | Attributes | Name | Type | Description |
                        |            | ...  | ...  | ...         |
                    */}
                    <tr>
                        <td className="font-bold p-2 border border-black bg-white align-top">Attributes</td>
                        {/* Header Row for Attributes embedded in the main table grid */}
                        <td className="p-0 border-none" colSpan={2}>
                            <table className="w-full border-collapse">
                                <tbody>
                                    <tr>
                                        <td className="border border-black bg-[#FDE9D9] p-2 font-bold w-[30%]">Name</td>
                                        <td className="border border-black bg-[#FDE9D9] p-2 font-bold w-[20%]">Type</td>
                                        <td className="border border-black bg-[#FDE9D9] p-2 font-bold">Description</td>
                                        <td className="print:hidden w-8 border-none bg-transparent"></td>
                                    </tr>
                                    {classData.attributes.map((attr, idx) => (
                                        <tr key={idx} className="group/row">
                                            <td className="border border-black p-1"><RichTextEditor initialContent={attr.name} onChange={(v) => updateAttribute(idx, 'name', v)} simple /></td>
                                            <td className="border border-black p-1"><RichTextEditor initialContent={attr.type} onChange={(v) => updateAttribute(idx, 'type', v)} simple /></td>
                                            <td className="border border-black p-1"><RichTextEditor initialContent={attr.description} onChange={(v) => updateAttribute(idx, 'description', v)} simple /></td>
                                            <td className="print:hidden text-center border-none p-0 align-middle">
                                                {classData.attributes.length > 1 && (
                                                    <button onClick={() => removeAttribute(idx)} className="text-red-500 font-bold opacity-0 group-hover/row:opacity-100 transition-opacity px-2">X</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="print:hidden">
                                        <td colSpan={4} className="border border-black p-1 text-center"><Button size="sm" variant="light" onPress={addAttribute}>+ Add Attribute</Button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    {/* Methods Section - Refactored based on image */}
                    <tr>
                        <td className="font-bold p-2 border border-black bg-white align-top">Methods</td>
                        <td className="p-0 border-none" colSpan={2}>
                            <table className="w-full border-collapse">
                                <tbody>
                                    <tr>
                                        <td className="border border-black bg-[#FDE9D9] p-2 font-bold w-[20%]">Name</td>
                                        <td className="border border-black bg-[#FDE9D9] p-2 font-bold w-[20%]">Input</td>
                                        <td className="border border-black bg-[#FDE9D9] p-2 font-bold w-[20%]">Output</td>
                                        <td className="border border-black bg-[#FDE9D9] p-2 font-bold">Description</td>
                                        <td className="print:hidden w-8 border-none bg-transparent"></td>
                                    </tr>
                                    {classData.methods.map((meth, idx) => (
                                        <tr key={idx} className="group/row">
                                            <td className="border border-black p-1"><RichTextEditor initialContent={meth.name} onChange={(v) => updateMethod(idx, 'name', v)} simple /></td>
                                            <td className="border border-black p-1"><RichTextEditor initialContent={meth.input} onChange={(v) => updateMethod(idx, 'input', v)} simple /></td>
                                            <td className="border border-black p-1"><RichTextEditor initialContent={meth.output} onChange={(v) => updateMethod(idx, 'output', v)} simple /></td>
                                            <td className="border border-black p-1"><RichTextEditor initialContent={meth.description} onChange={(v) => updateMethod(idx, 'description', v)} simple /></td>
                                            <td className="print:hidden text-center border-none p-0 align-middle">
                                                {classData.methods.length > 1 && (
                                                    <button onClick={() => removeMethod(idx)} className="text-red-500 font-bold opacity-0 group-hover/row:opacity-100 transition-opacity px-2">X</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="print:hidden">
                                        <td colSpan={5} className="border border-black p-1 text-center"><Button size="sm" variant="light" onPress={addMethod}>+ Add Method</Button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>
    );
};
