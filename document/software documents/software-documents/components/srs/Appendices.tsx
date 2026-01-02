
'use client';

import React, { useState } from 'react';
import { srsPrimitives } from '../primitives';
import { Button } from "@heroui/button";
import { RichTextEditor } from './RichTextEditor';

export const Appendices = () => {
    const [businessRules, setBusinessRules] = useState([
        { id: 'BR-01', definition: 'Delivery time windows are 15 minutes, beginning on each quarter hour.' }
    ]);

    const [messages, setMessages] = useState([
        { code: 'MSG01', type: 'In line', context: 'There is not any search result', content: 'No search results.' }
    ]);

    const [qualityAttributes, setQualityAttributes] = useState([
        { title: '4.2.1 Usability', content: '...' },
        { title: '4.2.2 Reliability', content: '...' },
        { title: '4.2.3 Performance', content: '...' }
    ]);

    const addRule = () => {
        setBusinessRules([...businessRules, { id: 'BR-0' + (businessRules.length + 1), definition: '' }]);
    };

    // Function to remove rules
    const removeRule = (index: number) => {
        if (confirm('Are you sure you want to delete this rule?')) {
            const newRules = [...businessRules];
            newRules.splice(index, 1);
            setBusinessRules(newRules);
        }
    };

    const addMessage = () => {
        setMessages([...messages, { code: 'MSG0' + (messages.length + 1), type: '', context: '', content: '' }]);
    };

    // Function to remove messages
    const removeMessage = (index: number) => {
        if (confirm('Are you sure you want to delete this message?')) {
            const newMessages = [...messages];
            newMessages.splice(index, 1);
            setMessages(newMessages);
        }
    };

    const addQualityAttribute = () => {
        setQualityAttributes([...qualityAttributes, {
            title: `4.2.${qualityAttributes.length + 1} New Attribute`,
            content: ''
        }]);
    };

    const removeQualityAttribute = (index: number) => {
        if (confirm('Are you sure you want to delete this Quality Attribute?')) {
            const newAttrs = [...qualityAttributes];
            newAttrs.splice(index, 1);
            setQualityAttributes(newAttrs);
        }
    };

    return (
        <div id="appendices">
            {/* 4. Non-Functional Requirements */}
            <div className={srsPrimitives.pageBreak} />

            <div className="non-functional-requirements">
                <p className="my-4 text-lg"><strong>4. Non-Functional Requirements</strong></p>

                <h3 className={srsPrimitives.h3}>4.1 External Interfaces</h3>
                <RichTextEditor initialContent="(Describe external interfaces here...)" className="mb-4" />

                <h3 className={srsPrimitives.h3}>4.2 Quality Attributes</h3>

                {qualityAttributes.map((attr, idx) => (
                    <div key={idx} className="group relative">
                        <div className="flex justify-between items-end">
                            <p className="font-bold italic mt-4">
                                <RichTextEditor initialContent={attr.title} simple className="inline-block" />
                            </p>
                            <div className="print:hidden opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" color="danger" variant="light" onPress={() => removeQualityAttribute(idx)}>Delete</Button>
                            </div>
                        </div>
                        <RichTextEditor initialContent={attr.content} className="mb-4" />
                    </div>
                ))}

                <div className="print:hidden my-4">
                    <Button size="sm" variant="flat" color="primary" onPress={addQualityAttribute}>+ Add Attribute</Button>
                </div>
            </div>

            {/* 5. Requirement Appendix */}
            <div className={srsPrimitives.pageBreak} />

            <div className="requirement-appendix">
                <p className="my-4 text-lg"><strong>5. Requirement Appendix</strong></p>

                <h3 className={srsPrimitives.h3}>5.1 Business Rules</h3>
                <table className={srsPrimitives.table}>
                    <thead>
                        <tr>
                            <th className="border border-[#1a1a1a] p-2 bg-[#FDE9D9] font-bold text-center w-24">ID</th>
                            <th className="border border-[#1a1a1a] p-2 bg-[#FDE9D9] font-bold text-center">Rule Definition</th>
                            <th className="border border-[#1a1a1a] p-2 bg-[#FDE9D9] font-bold w-12 print:hidden">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {businessRules.map((rule, idx) => (
                            <tr key={idx} className="group/row">
                                <td className={`${srsPrimitives.td} text-center`}>
                                    <RichTextEditor initialContent={rule.id} simple />
                                </td>
                                <td className={`${srsPrimitives.td} text-left`}>
                                    <RichTextEditor initialContent={rule.definition} simple />
                                </td>
                                <td className={`${srsPrimitives.td} text-center print:hidden bg-white border-0`}>
                                    <button onClick={() => removeRule(idx)} className="text-red-500 hover:text-red-700 font-bold opacity-0 group-hover/row:opacity-100 transition-opacity">
                                        X
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="print:hidden mb-8">
                    <Button size="sm" variant="flat" color="primary" onPress={addRule}>Add Rule</Button>
                </div>

                <h3 className={srsPrimitives.h3}>5.2 Common Requirements</h3>
                <RichTextEditor initialContent="(Add common requirements here...)" className="mb-4" />

                <h3 className={srsPrimitives.h3}>5.3 Application Messages List</h3>
                <table className={srsPrimitives.table}>
                    <thead>
                        <tr>
                            <th className="border border-[#1a1a1a] p-2 bg-[#FDE9D9] font-bold text-center w-12">#</th>
                            <th className="border border-[#1a1a1a] p-2 bg-[#FDE9D9] font-bold text-left">Message code</th>
                            <th className="border border-[#1a1a1a] p-2 bg-[#FDE9D9] font-bold text-left">Message Type</th>
                            <th className="border border-[#1a1a1a] p-2 bg-[#FDE9D9] font-bold text-left">Context</th>
                            <th className="border border-[#1a1a1a] p-2 bg-[#FDE9D9] font-bold text-left">Content</th>
                            <th className="border border-[#1a1a1a] p-2 bg-[#FDE9D9] font-bold w-12 print:hidden">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.map((msg, idx) => (
                            <tr key={idx} className="group/row">
                                <td className={`${srsPrimitives.td} text-center`}>{idx + 1}</td>
                                <td className={`${srsPrimitives.td}`}><RichTextEditor initialContent={msg.code} simple /></td>
                                <td className={`${srsPrimitives.td}`}><RichTextEditor initialContent={msg.type} simple /></td>
                                <td className={`${srsPrimitives.td}`}><RichTextEditor initialContent={msg.context} simple /></td>
                                <td className={`${srsPrimitives.td}`}><RichTextEditor initialContent={msg.content} simple /></td>
                                <td className={`${srsPrimitives.td} text-center print:hidden bg-white border-0`}>
                                    <button onClick={() => removeMessage(idx)} className="text-red-500 hover:text-red-700 font-bold opacity-0 group-hover/row:opacity-100 transition-opacity">
                                        X
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="print:hidden mb-8">
                    <Button size="sm" variant="flat" color="primary" onPress={addMessage}>Add Message</Button>
                </div>

                <h3 className={srsPrimitives.h3}>5.4 Other Requirements...</h3>
                <RichTextEditor initialContent="..." className="mb-4" />
            </div>
        </div>
    );
};
