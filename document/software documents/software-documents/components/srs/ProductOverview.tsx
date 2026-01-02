
'use client';

import React from 'react';
import { useSRS } from './SRSContext';
import { ImageUploader } from './ImageUploader';
import { RichTextEditor } from './RichTextEditor';

export const ProductOverview = () => {
    // Consume global state
    const { productOverview, setProductOverview } = useSRS();

    // Handlers
    const handleTextChange = (content: string) => {
        setProductOverview(prev => ({
            ...prev,
            text: content
        }));
    };

    const handleImageChange = (url: string | null) => {
        setProductOverview(prev => ({
            ...prev,
            imageUrl: url
        }));
    };

    return (
        <div id="product-overview">
            <p className="my-4 text-lg"><strong>1. Product Overview</strong></p>
            <div className="my-4">
                <RichTextEditor
                    initialContent={productOverview.text}
                    onChange={handleTextChange}
                />
            </div>
            <div className="my-4 flex flex-col items-center justify-center">
                <ImageUploader
                    placeholder="Click to upload Product Overview Diagram"
                    initialSrc={productOverview.imageUrl}
                    onImageChanged={handleImageChange}
                />
            </div>
        </div>
    );
};
