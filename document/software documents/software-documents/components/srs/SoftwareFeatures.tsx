
'use client';

import React, { useState } from 'react';
import { srsPrimitives } from '../primitives';
import { ImageUploader } from './ImageUploader';
import { RichTextEditor } from './RichTextEditor';
import UseCaseTemplate from './UseCaseTemplate';
import { Button } from "@heroui/button";
import { useSRS } from './SRSContext';

export const SoftwareFeatures = () => {
    // --- State for static tables 3.1.2, 3.1.3, 3.1.5, 3.1.6 ---

    // 3.1.2 Screen Descriptions
    const [screenDescRows, setScreenDescRows] = useState([
        { feature: 'Login', screen: 'Login Screen', desc: 'Screen for user authentication.' }
    ]);
    const addScreenDesc = () => setScreenDescRows([...screenDescRows, { feature: '', screen: '', desc: '' }]);
    const removeScreenDesc = (idx: number) => {
        if (confirm('Delete row?')) {
            const n = [...screenDescRows]; n.splice(idx, 1); setScreenDescRows(n);
        }
    };

    // 3.1.3 Screen Authorization
    const [screenAuthRows, setScreenAuthRows] = useState([
        { screen: 'Dashboard', admin: '✓', user: '✓', guest: '' }
    ]);
    const addScreenAuth = () => setScreenAuthRows([...screenAuthRows, { screen: '', admin: '', user: '', guest: '' }]);
    const removeScreenAuth = (idx: number) => {
        if (confirm('Delete row?')) {
            const n = [...screenAuthRows]; n.splice(idx, 1); setScreenAuthRows(n);
        }
    };

    // 3.1.5 Entities Description
    const [entitiesRows, setEntitiesRows] = useState([
        { entity: 'User', desc: 'Stores user account info.' }
    ]);
    const addEntity = () => setEntitiesRows([...entitiesRows, { entity: '', desc: '' }]);
    const removeEntity = (idx: number) => {
        if (confirm('Delete row?')) {
            const n = [...entitiesRows]; n.splice(idx, 1); setEntitiesRows(n);
        }
    };

    // 3.1.6 Entity Details
    const [entityDetailsRows, setEntityDetailsRows] = useState([
        { name: 'id', pk: '✓', type: 'UUID', mandatory: 'Yes', desc: 'Primary key' }
    ]);
    const addEntityDetail = () => setEntityDetailsRows([...entityDetailsRows, { name: '', pk: '', type: '', mandatory: '', desc: '' }]);
    const removeEntityDetail = (idx: number) => {
        if (confirm('Delete row?')) {
            const n = [...entityDetailsRows]; n.splice(idx, 1); setEntityDetailsRows(n);
        }
    };

    // --- State for Features from Context ---
    const { features, setFeatures } = useSRS();

    // Helper to generate IDs
    const generateId = () => Math.random().toString(36).substr(2, 9);

    const addFeatureSection = () => {
        setFeatures([...features, {
            id: generateId(),
            headerTitle: '<< New Feature >>',
            useCases: [{
                id: generateId(),
                fid: 'FID',
                functionName: 'Function Name',
                ucId: 'UCxx',
                useCaseName: 'New Use Case'
            }]
        }]);
    };

    const addUseCase = (featureIndex: number) => {
        const newFeatures = [...features];
        newFeatures[featureIndex].useCases.push({
            id: generateId(),
            fid: 'FID',
            functionName: 'Function Name',
            ucId: 'UCxx',
            useCaseName: 'New Use Case'
        });
        setFeatures(newFeatures);
    };

    const deleteFeatureSection = (id: string, index: number) => {
        if (features.length <= 1) {
            alert("Cannot delete the last feature section.");
            return;
        }

        if (confirm('Are you sure you want to delete this entire Feature Section?')) {
            setFeatures(features.filter(f => f.id !== id));
        }
    };

    const deleteUseCase = (featureIndex: number, ucId: string) => {
        // Prevent deleting the last use case if it's the only one in the only feature
        if (features.length === 1 && features[0].useCases.length === 1) {
            alert('Cannot delete the last remaining Use Case in the document.');
            return;
        }

        if (confirm('Are you sure you want to delete this Use Case?')) {
            const newFeatures = [...features];
            newFeatures[featureIndex].useCases = newFeatures[featureIndex].useCases.filter(uc => uc.id !== ucId);
            setFeatures(newFeatures);
        }
    };

    // Counters for sequential numbering across ALL features/use cases
    let globalTableCounter = 1;
    let globalFigureCounter = 1;

    return (
        <div id="software-features">
            <p className="my-4 text-lg"><strong>3. Software Features</strong></p>

            {/* 3.1 Functional Overview (Static for now as per previous reqs) */}
            <div id="functional-overview">
                <h3 className={srsPrimitives.h3}>
                    3.1 Functional Overview
                </h3>
                <p className="my-4"><strong><em>3.1.1 Screens Flow</em></strong></p>
                <div className="my-4 flex flex-col items-center justify-center">
                    <ImageUploader placeholder="Click to upload Screen Flow Diagram" />
                </div>

                <p className="my-4"><strong><em>3.1.2 Screen Descriptions</em></strong></p>
                <div className="w-full overflow-x-auto">
                    <table className={srsPrimitives.table}>
                        <thead>
                            <tr>
                                <th className={`${srsPrimitives.th} text-center`}>#</th>
                                <th className={`${srsPrimitives.th} text-left`}>Feature</th>
                                <th className={`${srsPrimitives.th} text-left`}>Screen</th>
                                <th className={`${srsPrimitives.th} text-left`}>Description</th>
                                <th className="print:hidden w-8 border-0"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {screenDescRows.map((row, idx) => (
                                <tr key={idx} className="group/row">
                                    <td className={`${srsPrimitives.td} text-center`}>{idx + 1}</td>
                                    <td className={`${srsPrimitives.td} text-left`}>
                                        <RichTextEditor initialContent={row.feature} simple />
                                    </td>
                                    <td className={`${srsPrimitives.td} text-left`}>
                                        <RichTextEditor initialContent={row.screen} simple />
                                    </td>
                                    <td className={`${srsPrimitives.td} text-left`}>
                                        <RichTextEditor initialContent={row.desc} simple />
                                    </td>
                                    <td className="print:hidden border-0 p-0 text-center align-middle">
                                        <button onClick={() => removeScreenDesc(idx)} className="text-red-500 font-bold opacity-0 group-hover/row:opacity-100 transition-opacity px-2">X</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="print:hidden my-2">
                        <Button size="sm" variant="flat" color="primary" onPress={addScreenDesc}>Add Row</Button>
                    </div>
                </div>

                <p className="my-4"><strong><em>3.1.3 Screen Authorization</em></strong></p>
                <div className="w-full overflow-x-auto">
                    <table className={srsPrimitives.table}>
                        <thead>
                            <tr>
                                <th className={`${srsPrimitives.th} text-center`}>#</th>
                                <th className={`${srsPrimitives.th} text-left`}>Screen</th>
                                <th className={`${srsPrimitives.th} text-center`}>Admin</th>
                                <th className={`${srsPrimitives.th} text-center`}>User</th>
                                <th className={`${srsPrimitives.th} text-center`}>Guest</th>
                                <th className="print:hidden w-8 border-0"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {screenAuthRows.map((row, idx) => (
                                <tr key={idx} className="group/row">
                                    <td className={`${srsPrimitives.td} text-center`}>{idx + 1}</td>
                                    <td className={`${srsPrimitives.td} text-left`}>
                                        <RichTextEditor initialContent={row.screen} simple />
                                    </td>
                                    <td className={`${srsPrimitives.td} text-center`}>
                                        <RichTextEditor initialContent={row.admin} simple />
                                    </td>
                                    <td className={`${srsPrimitives.td} text-center`}>
                                        <RichTextEditor initialContent={row.user} simple />
                                    </td>
                                    <td className={`${srsPrimitives.td} text-center`}>
                                        <RichTextEditor initialContent={row.guest} simple />
                                    </td>
                                    <td className="print:hidden border-0 p-0 text-center align-middle">
                                        <button onClick={() => removeScreenAuth(idx)} className="text-red-500 font-bold opacity-0 group-hover/row:opacity-100 transition-opacity px-2">X</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="print:hidden my-2">
                        <Button size="sm" variant="flat" color="primary" onPress={addScreenAuth}>Add Row</Button>
                    </div>
                </div>

                <div className={srsPrimitives.pageBreak} />

                <p className="my-4"><strong><em>3.1.5 Entity Relationship Diagram</em></strong></p>
                <div className="my-4 flex flex-col items-center justify-center">
                    <ImageUploader placeholder="Click to upload ERD Image" />
                </div>

                <p className="my-4"><u>Entities Description</u></p>
                <table className={srsPrimitives.table}>
                    <thead>
                        <tr>
                            <th className={`${srsPrimitives.th} text-center w-12`}>#</th>
                            <th className={`${srsPrimitives.th} text-left w-48`}>Entity</th>
                            <th className={`${srsPrimitives.th} text-left`}>Description</th>
                            <th className="print:hidden w-8 border-0"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {entitiesRows.map((row, idx) => (
                            <tr key={idx} className="group/row">
                                <td className={`${srsPrimitives.td} text-center`}>{idx + 1}</td>
                                <td className={`${srsPrimitives.td} text-left`}>
                                    <RichTextEditor initialContent={row.entity} simple />
                                </td>
                                <td className={`${srsPrimitives.td} text-left`}>
                                    <RichTextEditor initialContent={row.desc} simple />
                                </td>
                                <td className="print:hidden border-0 p-0 text-center align-middle">
                                    <button onClick={() => removeEntity(idx)} className="text-red-500 font-bold opacity-0 group-hover/row:opacity-100 transition-opacity px-2">X</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="print:hidden my-2">
                    <Button size="sm" variant="flat" color="primary" onPress={addEntity}>Add Entity</Button>
                </div>

                <p className="my-4"><strong><em>3.1.6 Entity Details</em></strong></p>
                <p className="my-4 font-bold"><RichTextEditor initialContent="1. Product" simple tagName="span" /></p>
                <table className={srsPrimitives.table}>
                    <thead>
                        <tr>
                            <th className={`${srsPrimitives.th} text-center`}>#</th>
                            <th className={`${srsPrimitives.th} text-left`}>Attribute name</th>
                            <th className={`${srsPrimitives.th} text-center`}>PK</th>
                            <th className={`${srsPrimitives.th} text-left`}>Type</th>
                            <th className={`${srsPrimitives.th} text-left`}>Mandatory</th>
                            <th className={`${srsPrimitives.th} text-left`}>Description</th>
                            <th className="print:hidden w-8 border-0"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {entityDetailsRows.map((row, idx) => (
                            <tr key={idx} className="group/row">
                                <td className={`${srsPrimitives.td} text-center`}>{idx + 1}</td>
                                <td className={`${srsPrimitives.td} text-left`}>
                                    <RichTextEditor initialContent={row.name} simple />
                                </td>
                                <td className={`${srsPrimitives.td} text-center`}>
                                    <RichTextEditor initialContent={row.pk} simple />
                                </td>
                                <td className={`${srsPrimitives.td} text-left`}>
                                    <RichTextEditor initialContent={row.type} simple />
                                </td>
                                <td className={`${srsPrimitives.td} text-left`}>
                                    <RichTextEditor initialContent={row.mandatory} simple />
                                </td>
                                <td className={`${srsPrimitives.td} text-left`}>
                                    <RichTextEditor initialContent={row.desc} simple />
                                </td>
                                <td className="print:hidden border-0 p-0 text-center align-middle">
                                    <button onClick={() => removeEntityDetail(idx)} className="text-red-500 font-bold opacity-0 group-hover/row:opacity-100 transition-opacity px-2">X</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="print:hidden my-2">
                    <Button size="sm" variant="flat" color="primary" onPress={addEntityDetail}>Add Attribute</Button>
                </div>
            </div>

            <div className={srsPrimitives.pageBreak} />

            {/* Dynamic Features Section */}
            {features.map((feature, fIndex) => {
                const featureNumber = `3.${fIndex + 2}`;
                return (
                    <div key={feature.id} id={`feature-${fIndex}`} className="mb-4">
                        <div className="flex justify-between items-baseline group">
                            <h3 className={srsPrimitives.h3}>
                                {featureNumber} <RichTextEditor initialContent={feature.headerTitle} simple className="inline-block" />
                            </h3>
                            <div className="print:hidden opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" color="danger" variant="light" onPress={() => deleteFeatureSection(feature.id, fIndex)}>Delete Section</Button>
                            </div>
                        </div>

                        {feature.useCases.map((uc, uIndex) => {
                            const ucNumber = `${featureNumber}.${uIndex + 1}`;
                            const currentTableNum = globalTableCounter++;
                            const currentFigureNum = globalFigureCounter++;

                            return (
                                <div key={uc.id} className="mt-4 group relative">
                                    <div className="print:hidden absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-10 w-fit">
                                        <Button size="sm" color="danger" variant="light" onPress={() => deleteUseCase(fIndex, uc.id)}>Delete UC</Button>
                                    </div>
                                    <UseCaseTemplate
                                        ucNumber={ucNumber}
                                        fid={uc.fid}
                                        functionName={uc.functionName}
                                        ucId={uc.ucId}
                                        useCaseName={uc.useCaseName}
                                        tableNumber={currentTableNum}
                                        figureNumber={currentFigureNum}
                                    />
                                </div>
                            )
                        })}

                        {/* Control Buttons for this Feature Section */}
                        <div className="print:hidden my-6 flex gap-2">
                            <Button size="sm" variant="flat" color="primary" onPress={() => addUseCase(fIndex)}>
                                + Add Use Case to {featureNumber}
                            </Button>
                        </div>
                    </div>
                );
            })}

            <div className="print:hidden my-8 border-t pt-4">
                <Button color="secondary" onPress={addFeatureSection}>
                    + Add New Feature Section (e.g. 3.{features.length + 2})
                </Button>
            </div>
        </div>
    );
};
