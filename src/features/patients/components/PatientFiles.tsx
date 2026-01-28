'use client';

import React, { useRef, useState } from 'react';
import { PatientFile } from '../types';
import { uploadFile, deleteFile } from '../actions/patientActions';
import { FileIcon, Trash2, UploadCloud, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PatientFilesProps {
    patientId: string;
    files: PatientFile[];
}

export function PatientFiles({ patientId, files }: PatientFilesProps) {
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        try {
            await uploadFile(patientId, formData);
        } catch (error) {
            console.error('Upload failed', error);
        } finally {
            setIsUploading(false);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    const handleDelete = async (id: string, url: string) => {
        if (!confirm('¿Eliminar archivo?')) return;
        await deleteFile(id, url);
    };

    return (
        <div className="space-y-4">
            <div
                onClick={() => inputRef.current?.click()}
                className={cn(
                    "border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer transition-all hover:border-primary-400 hover:bg-primary-50/50 group",
                    isUploading && "opacity-50 pointer-events-none"
                )}
            >
                <input
                    type="file"
                    hidden
                    ref={inputRef}
                    onChange={handleUpload}
                />
                <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-primary-600">
                    {isUploading ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                    ) : (
                        <UploadCloud className="w-8 h-8" />
                    )}
                    <span className="font-medium">
                        {isUploading ? 'Subiendo...' : 'Click para subir archivo'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {files.map(file => (
                    <div key={file.id} className="relative group bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                            {file.file_type.startsWith('image/') ? (
                                <img src={file.file_url} alt={file.file_name} className="w-full h-full object-cover" />
                            ) : (
                                <FileIcon className="w-8 h-8 text-slate-400" />
                            )}
                        </div>
                        <p className="text-xs font-medium text-slate-700 truncate mb-1" title={file.file_name}>
                            {file.file_name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                            {new Date(file.uploaded_at).toLocaleDateString()}
                        </p>

                        <button
                            onClick={() => handleDelete(file.id, file.file_url)}
                            className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>

                        <a
                            href={file.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 z-0"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
