
'use client';

import React from 'react';
import { sddPrimitives } from './sddPrimitives';
import { RichTextEditor } from '../srs/RichTextEditor';
import { Button } from "@heroui/button";
import { useSDD } from './SDDContext';

export const Section5_Database = () => {
    const { sddData, setSDDData } = useSDD();

    // Database Tables Helpers
    const addTable = () => {
        const newData = { ...sddData };
        newData.databaseTables.push({
            tableName: 'New Table',
            fields: [{ fieldName: '', type: '', size: '', unique: '', notNull: '', pkFk: '', notes: '' }]
        });
        setSDDData(newData);
    };

    const removeTable = (idx: number) => {
        if (!confirm("Delete this table?")) return;
        const newData = { ...sddData };
        newData.databaseTables.splice(idx, 1);
        setSDDData(newData);
    };

    const updateTableName = (idx: number, val: string) => {
        const newData = { ...sddData };
        newData.databaseTables[idx].tableName = val;
        setSDDData(newData);
    };

    const addField = (tableIdx: number) => {
        const newData = { ...sddData };
        newData.databaseTables[tableIdx].fields.push({ fieldName: '', type: '', size: '', unique: '', notNull: '', pkFk: '', notes: '' });
        setSDDData(newData);
    };

    const removeField = (tableIdx: number, fieldIdx: number) => {
        if (sddData.databaseTables[tableIdx].fields.length <= 1) return;
        const newData = { ...sddData };
        newData.databaseTables[tableIdx].fields.splice(fieldIdx, 1);
        setSDDData(newData);
    };

    const updateField = (tableIdx: number, fieldIdx: number, key: string, val: string) => {
        const newData = { ...sddData };
        // @ts-ignore
        newData.databaseTables[tableIdx].fields[fieldIdx][key] = val;
        setSDDData(newData);
    };

    // Data Files Helpers
    const addDataFile = () => {
        const newData = { ...sddData };
        newData.dataFiles.push({ fileName: '', type: '', notes: '' });
        setSDDData(newData);
    };

    const removeDataFile = (idx: number) => {
        if (sddData.dataFiles.length <= 1) return;
        const newData = { ...sddData };
        newData.dataFiles.splice(idx, 1);
        setSDDData(newData);
    };

    const updateDataFile = (idx: number, key: string, val: string) => {
        const newData = { ...sddData };
        // @ts-ignore
        newData.dataFiles[idx][key] = val;
        setSDDData(newData);
    };

    return (
        <div className="mb-8">
            <h2 className={sddPrimitives.h2}>5. Database Design</h2>

            <h3 className={sddPrimitives.h3}>5.1 Database Design</h3>

            {sddData.databaseTables.map((table, tableIdx) => (
                <div key={tableIdx} className="my-6 group/table relative">
                    <div className="flex items-center justify-between mb-2">
                        <p className="font-bold italic text-black">
                            {String.fromCharCode(97 + tableIdx)}. <RichTextEditor initialContent={table.tableName} onChange={(v) => updateTableName(tableIdx, v)} simple className="inline-block font-bold" />
                        </p>
                        {sddData.databaseTables.length > 1 && (
                            <Button
                                size="sm"
                                color="danger"
                                variant="light"
                                isIconOnly
                                onPress={() => removeTable(tableIdx)}
                                className="print:hidden opacity-0 group-hover/table:opacity-100 transition-opacity"
                                title="Delete Table"
                            >
                                X
                            </Button>
                        )}
                    </div>

                    <table className={sddPrimitives.table}>
                        <thead>
                            <tr>
                                <th className={`${sddPrimitives.th} w-8`}>#</th>
                                <th className={sddPrimitives.th}>Field name</th>
                                <th className={sddPrimitives.th}>Type</th>
                                <th className={sddPrimitives.th}>Size</th>
                                <th className={sddPrimitives.th}>Unique</th>
                                <th className={sddPrimitives.th}>Not Null</th>
                                <th className={sddPrimitives.th}>PK/FK</th>
                                <th className={sddPrimitives.th}>Notes</th>
                                <th className="print:hidden w-8 border-none bg-transparent"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {table.fields.map((field, fieldIdx) => (
                                <tr key={fieldIdx} className="group/row">
                                    <td className="border border-[#1a1a1a] p-1 text-center">{fieldIdx + 1}</td>
                                    <td className="border border-[#1a1a1a] p-1"><RichTextEditor initialContent={field.fieldName} onChange={(v) => updateField(tableIdx, fieldIdx, 'fieldName', v)} simple /></td>
                                    <td className="border border-[#1a1a1a] p-1"><RichTextEditor initialContent={field.type} onChange={(v) => updateField(tableIdx, fieldIdx, 'type', v)} simple /></td>
                                    <td className="border border-[#1a1a1a] p-1"><RichTextEditor initialContent={field.size} onChange={(v) => updateField(tableIdx, fieldIdx, 'size', v)} simple /></td>
                                    <td className="border border-[#1a1a1a] p-1"><RichTextEditor initialContent={field.unique} onChange={(v) => updateField(tableIdx, fieldIdx, 'unique', v)} simple /></td>
                                    <td className="border border-[#1a1a1a] p-1"><RichTextEditor initialContent={field.notNull} onChange={(v) => updateField(tableIdx, fieldIdx, 'notNull', v)} simple /></td>
                                    <td className="border border-[#1a1a1a] p-1"><RichTextEditor initialContent={field.pkFk} onChange={(v) => updateField(tableIdx, fieldIdx, 'pkFk', v)} simple /></td>
                                    <td className="border border-[#1a1a1a] p-1"><RichTextEditor initialContent={field.notes} onChange={(v) => updateField(tableIdx, fieldIdx, 'notes', v)} simple /></td>
                                    <td className="print:hidden text-center border-none p-0 align-middle">
                                        {table.fields.length > 1 && (
                                            <button onClick={() => removeField(tableIdx, fieldIdx)} className="text-red-500 font-bold opacity-0 group-hover/row:opacity-100 transition-opacity px-2">X</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            <tr className="print:hidden">
                                <td colSpan={9} className="text-center p-1 border border-dashed">
                                    <Button size="sm" variant="light" onPress={() => addField(tableIdx)}>+ Add Field</Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ))}

            <div className="print:hidden mb-8">
                <Button size="sm" color="primary" onPress={addTable}>+ Add Database Table</Button>
            </div>

            <h3 className={sddPrimitives.h3}>5.2 Data File Design</h3>
            <table className={sddPrimitives.table}>
                <thead>
                    <tr>
                        <th className={`${sddPrimitives.th} w-8`}>#</th>
                        <th className={sddPrimitives.th}>File Name</th>
                        <th className={sddPrimitives.th}>Type</th>
                        <th className={sddPrimitives.th}>Notes</th>
                        <th className="print:hidden w-8 border-none bg-transparent"></th>
                    </tr>
                </thead>
                <tbody>
                    {sddData.dataFiles.map((file, idx) => (
                        <tr key={idx} className="group/row">
                            <td className="border border-[#1a1a1a] p-1 text-center">{idx + 1}</td>
                            <td className="border border-[#1a1a1a] p-1"><RichTextEditor initialContent={file.fileName} onChange={(v) => updateDataFile(idx, 'fileName', v)} simple placeholder="<filename>" /></td>
                            <td className="border border-[#1a1a1a] p-1"><RichTextEditor initialContent={file.type} onChange={(v) => updateDataFile(idx, 'type', v)} simple /></td>
                            <td className="border border-[#1a1a1a] p-1"><RichTextEditor initialContent={file.notes} onChange={(v) => updateDataFile(idx, 'notes', v)} simple /></td>
                            <td className="print:hidden text-center border-none p-0 align-middle">
                                {sddData.dataFiles.length > 1 && (
                                    <button onClick={() => removeDataFile(idx)} className="text-red-500 font-bold opacity-0 group-hover/row:opacity-100 transition-opacity px-2">X</button>
                                )}
                            </td>
                        </tr>
                    ))}
                    <tr className="print:hidden">
                        <td colSpan={5} className="text-center p-1 border border-dashed">
                            <Button size="sm" variant="light" onPress={addDataFile}>+ Add Record</Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
