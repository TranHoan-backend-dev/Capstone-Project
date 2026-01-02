'use client';

import React, { useState } from 'react';
import { Button } from "@heroui/button";
import { RichTextEditor } from '../srs/RichTextEditor';
import { srsPrimitives } from '../primitives';

// NOTE: Ideally, this component should accept data from props/context to be persistent.
// For now, to solve the "Template" request, we make it purely UI + managed state.
// We can lift the state up later if full persistence is required for the specific rows.

export const RecordOfChanges = () => {
    const [rows, setRows] = useState([
        { no: '1', version: '1.0', date: '02/01/2026', author: 'Admin', details: 'Initial Release' }
    ]);

    const addRow = () => {
        setRows([...rows, { no: (rows.length + 1).toString(), version: '', date: '', author: '', details: '' }]);
    };

    const removeRow = (index: number) => {
        if (confirm('Are you sure you want to delete this row?')) {
            const newRows = [...rows];
            newRows.splice(index, 1);
            setRows(newRows);
        }
    };

    return (
        <div id="record-of-changes" className="mb-8 font-[Segoe UI,Tahoma,Geneva,Verdana,sans-serif]">
            <h2 className={srsPrimitives.h2}>
                I. Record of changes
            </h2>
            <div className="w-full overflow-x-auto">
                <table className={srsPrimitives.table}>
                    <thead>
                        <tr>
                            <th className={`${srsPrimitives.th} w-12 text-center`}>No</th>
                            <th className={`${srsPrimitives.th} w-24 text-center`}>Version</th>
                            <th className={`${srsPrimitives.th} w-32 text-center`}>Date</th>
                            <th className={`${srsPrimitives.th} w-40 text-center`}>Author</th>
                            <th className={`${srsPrimitives.th} text-left`}>Change Details</th>
                            <th className="print:hidden w-8 border-0"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index} className="group/row">
                                <td className={`${srsPrimitives.td} text-center`}>
                                    <RichTextEditor initialContent={row.no} simple className="text-center" />
                                </td>
                                <td className={`${srsPrimitives.td} text-center`}>
                                    <RichTextEditor initialContent={row.version} simple className="text-center" />
                                </td>
                                <td className={`${srsPrimitives.td} text-center`}>
                                    <RichTextEditor initialContent={row.date} simple className="text-center" />
                                </td>
                                <td className={`${srsPrimitives.td} text-center`}>
                                    <RichTextEditor initialContent={row.author} simple className="text-center" />
                                </td>
                                <td className={`${srsPrimitives.td} text-left`}>
                                    <RichTextEditor initialContent={row.details} simple />
                                </td>
                                <td className="print:hidden border-0 p-0 text-center align-middle">
                                    <button onClick={() => removeRow(index)} className="text-red-500 font-bold opacity-0 group-hover/row:opacity-100 transition-opacity px-2">X</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="print:hidden my-2">
                <Button size="sm" variant="flat" color="primary" onPress={addRow}>Add Row</Button>
            </div>
        </div>
    );
};
