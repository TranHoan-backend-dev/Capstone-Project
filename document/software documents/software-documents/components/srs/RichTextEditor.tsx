
'use client';

import React, { useRef, useState, useEffect } from 'react';

interface RichTextEditorProps {
    initialContent?: string;
    placeholder?: string;
    className?: string;
    tagName?: 'div' | 'span' | 'p';
    simple?: boolean; // If true, simpler toolbar or just inline
    onChange?: (content: string) => void; // Added onChange prop
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    initialContent = '',
    placeholder = '',
    className = '',
    tagName = 'div',
    simple = false,
    onChange
}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [showToolbar, setShowToolbar] = useState(false);

    // Update internal content if initialContent changes (e.g. from parent reset)
    // We only want to do this if we are not currently focusing/editing to avoid cursor jumps
    // but for simple reset logic, we can check document.activeElement
    useEffect(() => {
        if (editorRef.current && document.activeElement !== editorRef.current) {
            if (editorRef.current.innerHTML !== initialContent) {
                editorRef.current.innerHTML = initialContent;
            }
        }
    }, [initialContent]);

    const execCmd = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        if (editorRef.current && onChange) {
            onChange(editorRef.current.innerHTML);
        }
    };

    // Handle input to trigger onChange
    const handleInput = () => {
        if (editorRef.current && onChange) {
            onChange(editorRef.current.innerHTML);
        }
    };

    // Handle selection changes to potentially keep sidebar active if selection is inside
    useEffect(() => {
        const handleSelectionChange = () => {
            const sel = window.getSelection();
            if (sel && sel.anchorNode && editorRef.current && editorRef.current.contains(sel.anchorNode)) {
                // selection is in this editor
            }
        };
        document.addEventListener('selectionchange', handleSelectionChange);
        return () => document.removeEventListener('selectionchange', handleSelectionChange);
    }, []);

    const handleFocus = () => setShowToolbar(true);
    const handleBlur = (e: React.FocusEvent) => {
        // Only hide if we aren't moving focus to the toolbar (e.relatedTarget)
        if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
            setShowToolbar(false);
        }
        // Also trigger onChange on blur to be safe
        if (editorRef.current && onChange) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const Toolbar = () => (
        <div className="flex gap-1 mb-1 p-1 bg-gray-100 rounded border border-gray-200 print:hidden absolute bottom-full left-0 z-50 w-max shadow-md">
            <button onMouseDown={(e) => { e.preventDefault(); execCmd('bold'); }} className="p-1 hover:bg-gray-200 rounded font-bold w-6 h-6 flex items-center justify-center">B</button>
            <button onMouseDown={(e) => { e.preventDefault(); execCmd('italic'); }} className="p-1 hover:bg-gray-200 rounded italic w-6 h-6 flex items-center justify-center">I</button>
            <button onMouseDown={(e) => { e.preventDefault(); execCmd('underline'); }} className="p-1 hover:bg-gray-200 rounded underline w-6 h-6 flex items-center justify-center">U</button>
            {!simple && (
                <>
                    <div className="w-[1px] bg-gray-300 mx-1" />
                    <button onMouseDown={(e) => { e.preventDefault(); execCmd('insertUnorderedList'); }} className="p-1 hover:bg-gray-200 rounded w-6 h-6 flex items-center justify-center">•</button>
                    <button onMouseDown={(e) => { e.preventDefault(); execCmd('insertOrderedList'); }} className="p-1 hover:bg-gray-200 rounded w-6 h-6 flex items-center justify-center">1.</button>
                </>
            )}
        </div>
    );

    return (
        <div className={`rich-text-editor relative ${className}`} onBlur={handleBlur} onFocus={handleFocus} tabIndex={-1}>
            {showToolbar && <Toolbar />}

            <div
                ref={editorRef}
                className="outline-none min-h-[1.5em] focus:border focus:border-blue-500 transition-colors p-[1px]"
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                dangerouslySetInnerHTML={{ __html: initialContent }}
            />
        </div>
    );
};
