import { useState, useEffect, useMemo, useCallback } from 'react';

interface UseResourceProps<T> {
    fetchFn: () => Promise<T[]>;
    deleteFn?: (id: number | string) => Promise<void>;
    filterFn?: (item: T, query: string) => boolean;
    initialSort?: (a: T, b: T) => number;
    initialPageSize?: number;
    onSuccess?: (data: T[]) => void;
}

export default function useResource<T extends { id: number | string }>({
    fetchFn,
    deleteFn,
    filterFn,
    initialSort,
    initialPageSize = 10,
    onSuccess
}: UseResourceProps<T>) {
    const [allItems, setAllItems] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<T | null>(null);

    const loadData = useCallback(async (showLoader = true) => {
        try {
            if (showLoader) setIsLoading(true);
            const result = await fetchFn();
            setAllItems(initialSort ? result.sort(initialSort) : result);
            if (onSuccess) onSuccess(result);
            setError(null);
            // Reset to first page when data is reloaded/refreshed
            setCurrentPage(1);
        } catch (err: any) {
            setError(err.message || 'Помилка при завантаженні даних');
        } finally {
            if (showLoader) setIsLoading(false);
        }
    }, [fetchFn, initialSort]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredData = useMemo(() => {
        return allItems.filter(item => {
            if (filterFn) return filterFn(item, searchQuery);
            if (!searchQuery) return true;
            // Default simple search if no filterFn provided
            const searchableString = JSON.stringify(item).toLowerCase();
            return searchableString.includes(searchQuery.toLowerCase());
        });
    }, [allItems, searchQuery, filterFn]);

    // Reset page to 1 when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredData.slice(startIndex, startIndex + pageSize);
    }, [filteredData, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredData.length / pageSize);

    const handleCreateOpen = () => {
        setSelectedItem(null);
        setShowCreateModal(true);
    };

    const handleEditOpen = (item: T) => {
        setSelectedItem(item);
        setShowEditModal(true);
    };

    const handleDeleteOpen = (item: T) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!selectedItem || !deleteFn) return;
        try {
            setIsSubmitting(true);
            const id = typeof selectedItem.id === 'string' ? selectedItem.id : Number(selectedItem.id);
            await deleteFn(id);
            setShowDeleteModal(false);
            setSelectedItem(null);
            await loadData(false);
        } catch (err: any) {
            alert(err.message || 'Помилка при видаленні');
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModals = () => {
        setShowCreateModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setSelectedItem(null);
    };

    return {
        allItems,
        filteredData,
        paginatedData,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        totalPages,
        totalItems: filteredData.length,
        isSubmitting,
        setIsSubmitting,
        showCreateModal,
        setShowCreateModal,
        showEditModal,
        setShowEditModal,
        showDeleteModal,
        setShowDeleteModal,
        selectedItem,
        setSelectedItem,
        loadData,
        handleCreateOpen,
        handleEditOpen,
        handleDeleteOpen,
        handleDelete,
        closeModals
    };
}
