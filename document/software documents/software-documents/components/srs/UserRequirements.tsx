
'use client';

import React, { useState } from 'react';
import { srsPrimitives } from '../primitives';
import { Button } from "@heroui/button";
import { ImageUploader } from './ImageUploader';
import { RichTextEditor } from './RichTextEditor';

export const UserRequirements = () => {
    // Actors State
    const [actors, setActors] = useState([
        { id: 1, actor: 'Admin', description: 'System administrator with full access.' },
        { id: 2, actor: 'User', description: 'Regular end-user.' }
    ]);

    const addActor = () => {
        setActors([...actors, { id: actors.length + 1, actor: '', description: '' }]);
    };

    const removeActor = (index: number) => {
        if (confirm('Are you sure you want to delete this actor?')) {
            const newActors = [...actors];
            newActors.splice(index, 1);
            setActors(newActors);
        }
    };

    // UseCases State
    const [useCases, setUseCases] = useState([
        { id: 'UC01', group: 'Auth', name: 'Login', actors: 'User, Admin', desc: 'Allow users to log in to the system.' }
    ]);

    const addUseCase = () => {
        setUseCases([...useCases, { id: '', group: '', name: '', actors: '', desc: '' }]);
    };

    const removeUseCase = (index: number) => {
        if (confirm('Are you sure you want to delete this use case description?')) {
            const newUCs = [...useCases];
            newUCs.splice(index, 1);
            setUseCases(newUCs);
        }
    };

    return (
        <div id="user-requirements">
            <p className="my-4 text-lg"><strong>2. User Requirements</strong></p>

            <div id="actors">
                <h3 className={srsPrimitives.h3}>
                    2.1 Actors
                </h3>
                <table className={srsPrimitives.table}>
                    <thead>
                        <tr>
                            <th className={`${srsPrimitives.th} text-center w-12`}>#</th>
                            <th className={`${srsPrimitives.th} text-left w-48`}>Actor</th>
                            <th className={`${srsPrimitives.th} text-left`}>Description</th>
                            <th className="print:hidden w-8 border-0"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {actors.map((row, index) => (
                            <tr key={index} className="group/row">
                                <td className={`${srsPrimitives.td} text-center`}>{row.id}</td>
                                <td className={`${srsPrimitives.td} text-left`}>
                                    <RichTextEditor initialContent={row.actor} simple />
                                </td>
                                <td className={`${srsPrimitives.td} text-left`}>
                                    <RichTextEditor initialContent={row.description} simple />
                                </td>
                                <td className="print:hidden border-0 p-0 text-center align-middle">
                                    <button onClick={() => removeActor(index)} className="text-red-500 font-bold opacity-0 group-hover/row:opacity-100 transition-opacity px-2">X</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="print:hidden my-2">
                    <Button size="sm" variant="flat" color="primary" onPress={addActor}>Add Actor</Button>
                </div>
            </div>

            <div id="use-cases">
                <h3 className={srsPrimitives.h3}>
                    2.2 Use Cases
                </h3>
                <p className="my-4"><strong><em>2.2.1 Diagram(s)</em></strong></p>
                <div className="my-4 flex flex-col items-center justify-center">
                    <ImageUploader placeholder="Click to upload Use Case Diagram" />
                    <RichTextEditor placeholder="Add diagram description here..." className="mt-2" />
                </div>

                <p className="my-4"><strong><em>2.2.2 Descriptions</em></strong></p>
                <table className={srsPrimitives.table}>
                    <colgroup>
                        <col style={{ width: '8%' }} />
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '15%' }} />
                        <col style={{ width: '15%' }} />
                        <col style={{ width: '42%' }} />
                        <col className="print:hidden" style={{ width: '2%' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th className={`${srsPrimitives.th} text-center`}>ID</th>
                            <th className={`${srsPrimitives.th} text-left`}>Group function</th>
                            <th className={`${srsPrimitives.th} text-left`}>Use Case</th>
                            <th className={`${srsPrimitives.th} text-left`}>Actors</th>
                            <th className={`${srsPrimitives.th} text-left`}>Description</th>
                            <th className="print:hidden w-8 border-0"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {useCases.map((row, index) => (
                            <tr key={index} className="group/row">
                                <td className={`${srsPrimitives.td} text-center`}>
                                    <RichTextEditor initialContent={row.id} simple className="text-center" />
                                </td>
                                <td className={`${srsPrimitives.td} text-left`}>
                                    <RichTextEditor initialContent={row.group} simple />
                                </td>
                                <td className={`${srsPrimitives.td} text-left`}>
                                    <RichTextEditor initialContent={row.name} simple />
                                </td>
                                <td className={`${srsPrimitives.td} text-left`}>
                                    <RichTextEditor initialContent={row.actors} simple />
                                </td>
                                <td className={`${srsPrimitives.td} text-left`}>
                                    <RichTextEditor initialContent={row.desc} simple />
                                </td>
                                <td className="print:hidden border-0 p-0 text-center align-middle">
                                    <button onClick={() => removeUseCase(index)} className="text-red-500 font-bold opacity-0 group-hover/row:opacity-100 transition-opacity px-2">X</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="print:hidden my-2">
                    <Button size="sm" variant="flat" color="primary" onPress={addUseCase}>Add Use Case</Button>
                </div>
            </div>
        </div>
    );
};
