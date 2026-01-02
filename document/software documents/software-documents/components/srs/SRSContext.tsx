
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';

// UseCase Data Structures
export interface UseCaseData {
    id: string; // internal unique id
    fid: string;
    functionName: string;
    ucId: string;
    useCaseName: string;
}

export interface FeatureSection {
    id: string; // internal unique id
    headerTitle: string; // e.g., "<< Feature Name >>"
    useCases: UseCaseData[];
}

export interface ProductOverviewData {
    text: string;
    imageUrl: string | null;
}

// Global data structure for the entire SRS - updated to include more sections
export interface SRSData {
    features: FeatureSection[];
    productOverview: ProductOverviewData;
}

interface SRSContextType {
    features: FeatureSection[];
    setFeatures: React.Dispatch<React.SetStateAction<FeatureSection[]>>;
    productOverview: ProductOverviewData;
    setProductOverview: React.Dispatch<React.SetStateAction<ProductOverviewData>>;
    isSaving: boolean;
    resetData: () => Promise<void>;
}

const SRSContext = createContext<SRSContextType | undefined>(undefined);

const DEFAULT_FEATURES: FeatureSection[] = [
    {
        id: 'feat-1',
        headerTitle: '<< Feature Name 1 >>',
        useCases: [
            {
                id: 'uc-1',
                fid: 'FID',
                functionName: 'Function Name 1',
                ucId: 'UC01',
                useCaseName: 'Use Case Name'
            }
        ]
    }
];

const DEFAULT_PRODUCT_OVERVIEW: ProductOverviewData = {
    text: "The product is a...",
    imageUrl: null
};

export const SRSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Shared State
    const [features, setFeatures] = useState<FeatureSection[]>(DEFAULT_FEATURES);
    const [productOverview, setProductOverview] = useState<ProductOverviewData>(DEFAULT_PRODUCT_OVERVIEW);

    const [isSaving, setIsSaving] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Ref to track if we've done the initial load to avoid overwriting file with default state immediately
    const isInitialLoadDone = useRef(false);

    // Load data on mount
    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('/api/srs-data');
                const data = await res.json();

                // Load Features
                if (data && data.features && data.features.length > 0) {
                    setFeatures(data.features);
                }

                // Load Product Overview
                if (data && data.productOverview) {
                    setProductOverview(data.productOverview);
                }

            } catch (error) {
                console.error("Failed to load SRS data:", error);
            } finally {
                setIsLoaded(true);
                isInitialLoadDone.current = true;
            }
        };
        load();
    }, []);

    // Auto-Save Effect
    useEffect(() => {
        // Only auto-save if we have finished loading
        if (!isInitialLoadDone.current) return;

        const timer = setTimeout(async () => {
            setIsSaving(true);
            try {
                const dataToSave: SRSData = {
                    features: features,
                    productOverview: productOverview
                };

                await fetch('/api/srs-data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSave)
                });
            } catch (error) {
                console.error("Failed to auto-save SRS data:", error);
            } finally {
                setIsSaving(false);
            }
        }, 1000); // Debounce 1s

        return () => clearTimeout(timer);
    }, [features, productOverview]);

    const resetData = async () => {
        if (!confirm("Are you sure you want to reset all data to the original template? This cannot be undone.")) return;

        setFeatures(DEFAULT_FEATURES);
        setProductOverview(DEFAULT_PRODUCT_OVERVIEW);
        // The Auto-Save effect will pick this up and save it to the file
    };

    // Prevent rendering children until initial load check is done to avoid hydration mismatch
    if (!isLoaded) return <div className="p-8 text-center bg-gray-50 h-screen flex items-center justify-center text-gray-500">Loading SRS Document...</div>;

    return (
        <SRSContext.Provider value={{
            features, setFeatures,
            productOverview, setProductOverview,
            isSaving, resetData
        }}>
            {children}
            {/* Saving Indicator */}
            <div className={`fixed bottom-4 left-4 text-xs text-gray-400 transition-opacity duration-300 ${isSaving ? 'opacity-100' : 'opacity-0'} print:hidden z-50 bg-white/80 p-1 rounded`}>
                Saving...
            </div>
        </SRSContext.Provider>
    );
};

export const useSRS = () => {
    const context = useContext(SRSContext);
    if (!context) {
        throw new Error('useSRS must be used within an SRSProvider');
    }
    return context;
};
