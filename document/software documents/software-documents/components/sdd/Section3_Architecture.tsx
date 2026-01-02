
'use client';

import React from 'react';
import { sddPrimitives } from './sddPrimitives';
import { RichTextEditor } from '../srs/RichTextEditor';
import { ImageUploader } from '../srs/ImageUploader';
import { useSDD } from './SDDContext';
import { Button } from "@heroui/button";

export const Section3_SoftwareArchitecture = () => {
    const { sddData, setSDDData } = useSDD();

    // Helper for table updates
    const updateArchRow = (section: 'packages' | 'components' | 'deployments', idx: number, field: 'col1' | 'col2', val: string) => {
        const newData = { ...sddData };
        newData.architecture[section][idx][field] = val;
        setSDDData(newData);
    };

    // Helper for image updates
    const updateImage = (field: 'processViewImage' | 'packageDiagramImage' | 'componentDiagramImage' | 'deploymentViewImage', url: string | null) => {
        const newData = { ...sddData };
        newData[field] = url;
        setSDDData(newData);
    };

    const addRow = (section: 'packages' | 'components' | 'deployments') => {
        const newData = { ...sddData };
        newData.architecture[section].push({ col1: '', col2: '' });
        setSDDData(newData);
    };

    const removeRow = (section: 'packages' | 'components' | 'deployments', idx: number) => {
        if (sddData.architecture[section].length <= 1) return; // Prevent deleting last row
        if (!confirm("Remove this row?")) return;

        const newData = { ...sddData };
        newData.architecture[section].splice(idx, 1);
        setSDDData(newData);
    };

    return (
        <div className="mb-8">
            <h2 className={sddPrimitives.h2}>3 Software Architecture Design</h2>

            <h3 className={sddPrimitives.h3}>3.1 Architectural Representation</h3>
            <RichTextEditor initialContent={sddData.architecturalRepresentation} onChange={(v) => {
                const d = { ...sddData };
                d.architecturalRepresentation = v;
                setSDDData(d);
            }} simple placeholder="Describe the architectural representation..." />

            <h3 className={sddPrimitives.h3}>3.2 Software Architecture</h3>

            <h4 className={sddPrimitives.h4}>3.2.1 Process View</h4>
            <div className="pl-4 border-l-2 border-gray-100 ml-2">
                <p className="font-bold text-blue-600 my-2">3.2.1.1 &lt; Process name 1 &gt;</p>
                <div className="flex justify-center mb-4">
                    <ImageUploader
                        initialSrc={sddData.processViewImage}
                        onImageChanged={(url) => updateImage('processViewImage', url)}
                        placeholder="Upload Process Diagram"
                    />
                </div>
                <RichTextEditor initialContent="Process description..." simple />
            </div>

            <h4 className={sddPrimitives.h4}>3.2.2 Logical View</h4>
            <RichTextEditor initialContent="Describe the logical view..." simple />

            <h4 className={sddPrimitives.h4}>3.2.3 Development View</h4>
            <div className="pl-4">
                <p className="font-bold text-blue-600 my-2">3.2.3.1 Package Diagram</p>
                <div className="flex justify-center mb-4">
                    <ImageUploader
                        initialSrc={sddData.packageDiagramImage}
                        onImageChanged={(url) => updateImage('packageDiagramImage', url)}
                        placeholder="Upload Package Diagram"
                    />
                </div>

                <p className="font-bold italic mt-2">Packages Description</p>
                <table className={sddPrimitives.table}>
                    <thead>
                        <tr>
                            <th className={`${sddPrimitives.th} w-16`}>No</th>
                            <th className={`${sddPrimitives.th} w-1/3`}>Package</th>
                            <th className={sddPrimitives.th}>Description</th>
                            <th className="print:hidden w-8 border-none bg-transparent"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sddData.architecture.packages.map((row, idx) => (
                            <tr key={idx} className="group/row">
                                <td className={`${sddPrimitives.td} text-center`}>{idx + 1}</td>
                                <td className={sddPrimitives.td}><RichTextEditor initialContent={row.col1} onChange={(v) => updateArchRow('packages', idx, 'col1', v)} simple placeholder="<Package name>" /></td>
                                <td className={sddPrimitives.td}><RichTextEditor initialContent={row.col2} onChange={(v) => updateArchRow('packages', idx, 'col2', v)} simple placeholder="<Description>" /></td>
                                <td className="print:hidden text-center border-none p-0 align-middle">
                                    {sddData.architecture.packages.length > 1 && (
                                        <button onClick={() => removeRow('packages', idx)} className="text-red-500 font-bold opacity-0 group-hover/row:opacity-100 transition-opacity px-2">X</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        <tr className="print:hidden">
                            <td colSpan={4} className="text-center p-1 border-none">
                                <Button size="sm" variant="light" onPress={() => addRow('packages')}>+ Add Row</Button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p className="font-bold text-blue-600 my-2">3.2.3.2 Component Diagram [optional]</p>
                <div className="flex justify-center mb-4">
                    <ImageUploader
                        initialSrc={sddData.componentDiagramImage}
                        onImageChanged={(url) => updateImage('componentDiagramImage', url)}
                        placeholder="Upload Component Diagram"
                    />
                </div>

                <p className="font-bold italic mt-2">Components Description</p>
                <table className={sddPrimitives.table}>
                    <thead>
                        <tr>
                            <th className={`${sddPrimitives.th} w-16`}>No</th>
                            <th className={`${sddPrimitives.th} w-1/3`}>Component</th>
                            <th className={sddPrimitives.th}>Description</th>
                            <th className="print:hidden w-8 border-none bg-transparent"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sddData.architecture.components.map((row, idx) => (
                            <tr key={idx} className="group/row">
                                <td className={`${sddPrimitives.td} text-center`}>{idx + 1}</td>
                                <td className={sddPrimitives.td}><RichTextEditor initialContent={row.col1} onChange={(v) => updateArchRow('components', idx, 'col1', v)} simple placeholder="<name>" /></td>
                                <td className={sddPrimitives.td}><RichTextEditor initialContent={row.col2} onChange={(v) => updateArchRow('components', idx, 'col2', v)} simple placeholder="<Description>" /></td>
                                <td className="print:hidden text-center border-none p-0 align-middle">
                                    {sddData.architecture.components.length > 1 && (
                                        <button onClick={() => removeRow('components', idx)} className="text-red-500 font-bold opacity-0 group-hover/row:opacity-100 transition-opacity px-2">X</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        <tr className="print:hidden">
                            <td colSpan={4} className="text-center p-1 border-none">
                                <Button size="sm" variant="light" onPress={() => addRow('components')}>+ Add Row</Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h4 className={sddPrimitives.h4}>3.2.4 Deployment View</h4>
            <div className="pl-4">
                <p className="font-bold italic mt-2">Configuration Description</p>
                <table className={sddPrimitives.table}>
                    <thead>
                        <tr>
                            <th className={`${sddPrimitives.th} w-16`}>No</th>
                            <th className={`${sddPrimitives.th} w-1/3`}>Component/Node</th>
                            <th className={sddPrimitives.th}>Description</th>
                            <th className="print:hidden w-8 border-none bg-transparent"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sddData.architecture.deployments.map((row, idx) => (
                            <tr key={idx} className="group/row">
                                <td className={`${sddPrimitives.td} text-center`}>{idx + 1}</td>
                                <td className={sddPrimitives.td}><RichTextEditor initialContent={row.col1} onChange={(v) => updateArchRow('deployments', idx, 'col1', v)} simple placeholder="<name>" /></td>
                                <td className={sddPrimitives.td}><RichTextEditor initialContent={row.col2} onChange={(v) => updateArchRow('deployments', idx, 'col2', v)} simple placeholder="<Description>" /></td>
                                <td className="print:hidden text-center border-none p-0 align-middle">
                                    {sddData.architecture.deployments.length > 1 && (
                                        <button onClick={() => removeRow('deployments', idx)} className="text-red-500 font-bold opacity-0 group-hover/row:opacity-100 transition-opacity px-2">X</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        <tr className="print:hidden">
                            <td colSpan={4} className="text-center p-1 border-none">
                                <Button size="sm" variant="light" onPress={() => addRow('deployments')}>+ Add Row</Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
