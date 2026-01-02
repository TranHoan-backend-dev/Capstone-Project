
'use client';

import React from 'react';
import { sddPrimitives } from './sddPrimitives';
import { RichTextEditor } from '../srs/RichTextEditor';
import { ImageUploader } from '../srs/ImageUploader';
import { Button } from "@heroui/button";
import { useSDD } from './SDDContext';
import { ClassDesignTable } from './ClassDesignTable';

export const Section4_DetailedDesign = () => {
    const { sddData, setSDDData } = useSDD();

    const addComponent = () => {
        const newData = { ...sddData };
        newData.components.push({
            id: `comp-${Date.now()}`,
            ucId: 'UC...',
            name: 'New Component',
            screenImage: null,
            screenCaption: 'Figure x.x: Screen',
            screenDefinitions: [{ objectName: '', type: '', required: '', length: '', description: '' }],
            diagramImageUrl: null,
            classes: []
        });
        setSDDData(newData);
    };

    const removeComponent = (compIdx: number) => {
        if (sddData.components.length <= 1) return; // Prevent deleting last component
        if (!confirm("Delete this entire Use Case/Component section?")) return;
        const newData = { ...sddData };
        newData.components.splice(compIdx, 1);
        setSDDData(newData);
    };

    const addClassToComponent = (idx: number) => {
        const newData = { ...sddData };
        newData.components[idx].classes.push({
            className: 'NewClass',
            description: '',
            baseClass: '',
            constructor: '',
            prototype: '',
            sourceFile: '',
            namespace: '',
            attributes: [],
            methods: []
        });
        setSDDData(newData);
    };

    const removeClassFromComponent = (compIdx: number, classIdx: number) => {
        if (!confirm("Delete this class definition?")) return;
        const newData = { ...sddData };
        newData.components[compIdx].classes.splice(classIdx, 1);
        setSDDData(newData);
    };

    const updateCompField = (idx: number, field: string, val: any) => {
        const newData = { ...sddData };
        // @ts-ignore
        newData.components[idx][field] = val;
        setSDDData(newData);
    };

    // Screen Design Table Helpers
    const updateScreenDef = (compIdx: number, rowIdx: number, field: string, val: string) => {
        const newData = { ...sddData };
        // @ts-ignore
        newData.components[compIdx].screenDefinitions[rowIdx][field] = val;
        setSDDData(newData);
    };

    const addScreenDefRow = (compIdx: number) => {
        const newData = { ...sddData };
        newData.components[compIdx].screenDefinitions.push({ objectName: '', type: '', required: '', length: '', description: '' });
        setSDDData(newData);
    };

    const removeScreenDefRow = (compIdx: number, rowIdx: number) => {
        if (sddData.components[compIdx].screenDefinitions.length <= 1) return;
        const newData = { ...sddData };
        newData.components[compIdx].screenDefinitions.splice(rowIdx, 1);
        setSDDData(newData);
    };

    return (
        <div className="mb-8">
            <h2 className={sddPrimitives.h2}>4 Detailed Component Design</h2>

            <h3 className={sddPrimitives.h3}>4.1 Common Design</h3>
            <RichTextEditor initialContent="Describe common design elements..." simple />

            {/* Dynamic Components List */}
            {sddData.components.map((comp, idx) => (
                <div key={comp.id} className="mt-8 border-t pt-4 group/comp relative">
                    <h3 className={sddPrimitives.h3 + " flex items-center gap-4"}>
                        <span>
                            4.{idx + 2} <span className="inline-block min-w-[50px]"><RichTextEditor initialContent={comp.ucId ? comp.ucId : 'UC...'} onChange={(v) => updateCompField(idx, 'ucId', v)} simple className="inline-block" /></span> -
                            <span className="inline-block min-w-[100px]"><RichTextEditor initialContent={comp.name ? comp.name : 'Component Name'} onChange={(v) => updateCompField(idx, 'name', v)} simple className="inline-block" /></span>
                        </span>
                        {sddData.components.length > 1 && (
                            <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                variant="light"
                                onPress={() => removeComponent(idx)}
                                className="print:hidden opacity-0 group-hover/comp:opacity-100 transition-opacity"
                                title="Delete Component Section"
                            >
                                X
                            </Button>
                        )}
                    </h3>

                    <h4 className={sddPrimitives.h4}>4.{idx + 2}.1 Screen Design</h4>
                    <div className="pl-4">
                        {/* Centered Image Upload with Caption */}
                        <div className="flex flex-col items-center justify-center my-4">
                            <ImageUploader
                                initialSrc={comp.screenImage}
                                onImageChanged={(url) => updateCompField(idx, 'screenImage', url)}
                                placeholder="Upload Screen Design Image"
                            />
                            <div className="text-center font-bold italic mt-2 w-full max-w-md border-b border-transparent hover:border-gray-300">
                                <RichTextEditor
                                    initialContent={comp.screenCaption}
                                    onChange={(v) => updateCompField(idx, 'screenCaption', v)}
                                    simple
                                    className="text-center"
                                />
                            </div>
                        </div>

                        <p className="my-2"><strong>Table 4-{idx + 2}: {comp.name} Screen Definition</strong></p>

                        {/* Dynamic Screen Definition Table with Left Shift (No column removed) */}
                        <table className={sddPrimitives.table}>
                            <thead>
                                <tr>
                                    {/* Removed 'No' column as requested (dịch sang trái) */}
                                    <th className={sddPrimitives.th}>Object/Control Name</th>
                                    <th className={sddPrimitives.th}>Type</th>
                                    <th className={sddPrimitives.th}>Required</th>
                                    <th className={sddPrimitives.th}>Length</th>
                                    <th className={sddPrimitives.th}>Description</th>
                                    <th className="print:hidden w-8 border-none bg-transparent"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {comp.screenDefinitions && comp.screenDefinitions.map((row, rowIdx) => (
                                    <tr key={rowIdx} className="group/row">
                                        <td className={sddPrimitives.td}><RichTextEditor initialContent={row.objectName} onChange={(v) => updateScreenDef(idx, rowIdx, 'objectName', v)} simple /></td>
                                        <td className={sddPrimitives.td}><RichTextEditor initialContent={row.type} onChange={(v) => updateScreenDef(idx, rowIdx, 'type', v)} simple /></td>
                                        <td className={sddPrimitives.td}><RichTextEditor initialContent={row.required} onChange={(v) => updateScreenDef(idx, rowIdx, 'required', v)} simple /></td>
                                        <td className={sddPrimitives.td}><RichTextEditor initialContent={row.length} onChange={(v) => updateScreenDef(idx, rowIdx, 'length', v)} simple /></td>
                                        <td className={sddPrimitives.td}><RichTextEditor initialContent={row.description} onChange={(v) => updateScreenDef(idx, rowIdx, 'description', v)} simple /></td>
                                        <td className="print:hidden text-center border-none p-0 align-middle">
                                            {comp.screenDefinitions.length > 1 && (
                                                <button onClick={() => removeScreenDefRow(idx, rowIdx)} className="text-red-500 font-bold opacity-0 group-hover/row:opacity-100 transition-opacity px-2">X</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="print:hidden">
                                    <td colSpan={7} className="text-center p-1 border-none">
                                        <Button size="sm" variant="light" onPress={() => addScreenDefRow(idx)}>+ Add Row</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h4 className={sddPrimitives.h4}>4.{idx + 2}.2 Class/Component Design</h4>
                    <div className="pl-4">
                        <p className="font-bold text-blue-500 my-2">4.{idx + 2}.2.1 Classes/Component Structure</p>
                        <div className="flex justify-center">
                            <ImageUploader
                                initialSrc={comp.diagramImageUrl}
                                onImageChanged={(url) => updateCompField(idx, 'diagramImageUrl', url)}
                                placeholder="Upload Class/Component Diagram"
                            />
                        </div>

                        <p className="font-bold text-blue-500 my-2">4.{idx + 2}.2.2 Classes/Component Description</p>
                        <div className="pl-2">
                            {comp.classes.map((cls, classIdx) => (
                                <ClassDesignTable
                                    key={classIdx}
                                    classData={cls}
                                    componentIndex={idx}
                                    classIndex={classIdx}
                                    onRemove={() => removeClassFromComponent(idx, classIdx)}
                                />
                            ))}
                            <div className="print:hidden my-4">
                                <Button size="sm" onPress={() => addClassToComponent(idx)}>+ Add Class</Button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <div className="print:hidden my-8 p-4 border border-dashed text-center">
                <Button color="primary" onPress={addComponent}>+ Add New Feature/Use Case Section</Button>
            </div>
        </div>
    );
};
