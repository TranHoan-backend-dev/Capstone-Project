
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';

// Data Interfaces - Existing
export interface ClassAttribute {
    name: string;
    type: string;
    description: string;
}

export interface ClassMethod {
    name: string;
    input: string;
    output: string;
    description: string;
}

export interface ClassDesign {
    className: string;
    description: string;
    baseClass: string;
    constructor: string;
    prototype: string;
    sourceFile: string;
    namespace: string;
    attributes: ClassAttribute[];
    methods: ClassMethod[];
}

// New interfaces for Screen Design & Architecture
export interface ScreenDefinitionRow {
    objectName: string;
    type: string;
    required: string;
    length: string;
    description: string;
}

export interface ArchitectureTableRow {
    col1: string; // e.g. Package, Component/Node
    col2: string; // Description
}

export interface ArchitectureSectionData {
    packages: ArchitectureTableRow[];
    components: ArchitectureTableRow[];
    deployments: ArchitectureTableRow[];
}

export interface ComponentDesignSection {
    id: string;
    ucId: string;
    name: string;
    // Updated Screen Design fields
    screenImage: string | null;
    screenCaption: string;
    screenDefinitions: ScreenDefinitionRow[];

    diagramImageUrl: string | null;
    classes: ClassDesign[];
}

export interface DatabaseTable {
    tableName: string;
    fields: {
        fieldName: string;
        type: string;
        size: string;
        unique: string;
        notNull: string;
        pkFk: string;
        notes: string;
    }[];
}

export interface DataFile {
    fileName: string;
    type: string;
    notes: string;
}

export interface SDDData {
    introduction: string;
    systemOverview: string;
    designConstraints: string;
    architecturalRepresentation: string;

    // Architecture Diagrams
    processViewImage: string | null;
    packageDiagramImage: string | null;
    componentDiagramImage: string | null;
    deploymentViewImage: string | null;

    // New Architecture Data
    architecture: ArchitectureSectionData;

    components: ComponentDesignSection[];
    databaseTables: DatabaseTable[];
    dataFiles: DataFile[];
}

interface SDDContextType {
    sddData: SDDData;
    setSDDData: React.Dispatch<React.SetStateAction<SDDData>>;
    isSaving: boolean;
    resetData: () => Promise<void>;
}

const SDDContext = createContext<SDDContextType | undefined>(undefined);

const DEFAULT_ARCH_ROW = { col1: '', col2: '' };

const DEFAULT_SDD_DATA: SDDData = {
    introduction: '',
    systemOverview: '',
    designConstraints: '',
    architecturalRepresentation: '',

    processViewImage: null,
    packageDiagramImage: null,
    componentDiagramImage: null,
    deploymentViewImage: null,

    architecture: {
        packages: [{ ...DEFAULT_ARCH_ROW }],
        components: [{ ...DEFAULT_ARCH_ROW }],
        deployments: [{ ...DEFAULT_ARCH_ROW }]
    },

    components: [
        {
            id: 'comp-1',
            ucId: 'UC01',
            name: 'Login',
            screenImage: null,
            screenCaption: 'Figure 4.2.1: Login Screen',
            screenDefinitions: [
                { objectName: 'txtUsername', type: 'Textbox', required: 'Y', length: '50', description: 'Input username' }
            ],
            diagramImageUrl: null,
            classes: [
                {
                    className: 'LoginController',
                    description: 'Handles login logic',
                    baseClass: 'BaseController',
                    constructor: 'LoginController()',
                    prototype: '...',
                    sourceFile: 'LoginController.cs',
                    namespace: 'Auth',
                    attributes: [{ name: 'username', type: 'string', description: 'User login id' }],
                    methods: [{ name: 'Login', input: 'user, pass', output: 'bool', description: 'Validates credential' }]
                }
            ]
        }
    ],
    databaseTables: [
        {
            tableName: 'Users',
            fields: [
                { fieldName: 'ID', type: 'int', size: '4', unique: 'Y', notNull: 'Y', pkFk: 'PK', notes: 'Auto increment' },
                { fieldName: 'Username', type: 'varchar', size: '50', unique: 'Y', notNull: 'Y', pkFk: '', notes: '' }
            ]
        }
    ],
    dataFiles: [
        { fileName: 'config.json', type: 'JSON', notes: 'App configuration' }
    ]
};

export const SDDProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [sddData, setSDDData] = useState<SDDData>(DEFAULT_SDD_DATA);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const isInitialLoadDone = useRef(false);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('/api/sdd-data');
                const data = await res.json();
                if (data) {
                    // Start: Migration logic if structure changed (simple fallback)
                    if (!data.architecture) {
                        data.architecture = DEFAULT_SDD_DATA.architecture;
                    }
                    // Migration for new images
                    if (data.processViewImage === undefined) data.processViewImage = null;
                    if (data.packageDiagramImage === undefined) data.packageDiagramImage = null;
                    if (data.componentDiagramImage === undefined) data.componentDiagramImage = null;
                    if (data.deploymentViewImage === undefined) data.deploymentViewImage = null;

                    if (data.components) {
                        data.components = data.components.map((c: any) => ({
                            ...c,
                            screenDefinitions: c.screenDefinitions || [{ objectName: '', type: '', required: '', length: '', description: '' }],
                            screenCaption: c.screenCaption || `Figure: ${c.name} Screen`
                        }));
                    }
                    // End Migration logic
                    setSDDData(data);
                }
            } catch (error) {
                console.error("Failed to load SDD data:", error);
            } finally {
                setIsLoaded(true);
                isInitialLoadDone.current = true;
            }
        };
        load();
    }, []);

    useEffect(() => {
        if (!isInitialLoadDone.current) return;

        const timer = setTimeout(async () => {
            setIsSaving(true);
            try {
                await fetch('/api/sdd-data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(sddData)
                });
            } catch (error) {
                console.error("Failed to auto-save SDD data:", error);
            } finally {
                setIsSaving(false);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [sddData]);

    const resetData = async () => {
        if (!confirm("Reset SDD to default template? This cannot be undone.")) return;
        setSDDData(DEFAULT_SDD_DATA);
    };

    if (!isLoaded) return <div className="p-8 text-center">Loading SDD Document...</div>;

    return (
        <SDDContext.Provider value={{ sddData, setSDDData, isSaving, resetData }}>
            {children}
            <div className={`fixed bottom-4 left-4 text-xs text-gray-400 transition-opacity duration-300 ${isSaving ? 'opacity-100' : 'opacity-0'} print:hidden z-50 bg-white/80 p-1 rounded`}>
                Saving SDD...
            </div>
        </SDDContext.Provider>
    );
};

export const useSDD = () => {
    const context = useContext(SDDContext);
    if (!context) {
        throw new Error('useSDD must be used within an SDDProvider');
    }
    return context;
};
