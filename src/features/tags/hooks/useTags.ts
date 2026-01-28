'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tag } from '../types';
import { getTags } from '../actions/tagActions';

export function useTags() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTags = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getTags();
            setTags(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching tags:', err);
            setError('Error al cargar etiquetas');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTags();
    }, [fetchTags]);

    return {
        tags,
        isLoading,
        error,
        refreshTags: fetchTags
    };
}
