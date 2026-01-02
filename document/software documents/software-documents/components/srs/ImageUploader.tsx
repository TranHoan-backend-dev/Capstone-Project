
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@heroui/button";

interface ImageUploaderProps {
    label?: string;
    placeholder?: string;
    className?: string;
    initialSrc?: string | null;
    onImageChanged?: (url: string | null) => void; // Added call back
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
    label,
    placeholder = "Click to upload image",
    className = "",
    initialSrc = null,
    onImageChanged
}) => {
    const [imageSrc, setImageSrc] = useState<string | null>(initialSrc);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync initialSrc if it changes (rare, but good practice)
    useEffect(() => {
        // Only update if different
        if (initialSrc !== imageSrc) {
            setImageSrc(initialSrc || null);
        }
    }, [initialSrc]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const data = await response.json();
            const newUrl = data.url;

            setImageSrc(newUrl);
            if (onImageChanged) onImageChanged(newUrl); // Notify parent

        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    const removeImage = () => {
        if (confirm("Are you sure you want to remove this image?")) {
            setImageSrc(null);
            if (onImageChanged) onImageChanged(null); // Notify parent
        }
    };

    return (
        <div className={`image-uploader ${className} my-4`}>
            {label && <p className="mb-2 font-bold">{label}</p>}

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            {!imageSrc ? (
                <div
                    onClick={!uploading ? triggerUpload : undefined}
                    className={`border-2 border-dashed border-gray-300 p-8 rounded-lg cursor-pointer hover:bg-gray-50 flex flex-col items-center justify-center text-gray-500 transition-colors ${uploading ? 'opacity-50 cursor-wait' : ''}`}
                >
                    {uploading ? (
                        <span>Uploading...</span>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-center">{placeholder}</span>
                        </>
                    )}
                </div>
            ) : (
                <div className="relative group inline-block max-w-full">
                    <img
                        src={imageSrc}
                        alt="Uploaded content"
                        className="max-w-full h-auto border border-gray-200"
                    />
                    <div className="absolute top-2 right-2 hidden group-hover:flex print:hidden gap-2">
                        <Button
                            isIconOnly
                            size="sm"
                            color="primary"
                            variant="flat"
                            onPress={triggerUpload}
                            isDisabled={uploading}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </Button>
                        <Button
                            isIconOnly
                            size="sm"
                            color="danger"
                            variant="flat"
                            onPress={removeImage}
                            isDisabled={uploading}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
