"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store-context";

interface Product {
    _id: string;
    name: string;
    code: string;
    status: string;
    mode: string;
    slug: string;
    description: string;
    gender: string;
    category: {
        _id: string;
        name: string;
        slug: string;
    };
    basePrice: {
        currency: string;
        value: string;
    };
    variants: Array<{
        name: string;
        code: string;
        hex: string;
        status: string;
        gallery: Array<{
            url: string;
            _id: string;
        }>;
        active: boolean;
        sizes: Array<{
            sku: string;
            active: boolean;
            quantity: number;
            status: string;
            name: string;
            displayName: string;
        }>;
    }>;
    tags: string[];
    business: {
        _id: string;
        name: string;
        slug: string;
    };
    stockStatus: string;
    quantity: number | null;
}

interface Collection {
    _id: string;
    name: string;
    business: string;
    slug: string;
    description: string;
    products: string[];
    createdAt: string;
    updatedAt: string;
}

interface Category {
    _id: string;
    name: string;
    slug: string;
    gallery: string[];
}

interface ProductsResponse {
    status: string;
    data: {
        results: Product[];
        metadata: {
            totalCount: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
}

interface CategoriesResponse {
    status: string;
    data: {
        results: Category[];
        count: number;
    };
}

interface CollectionsResponse {
    status: string;
    data: {
        results: Collection[];
        count: number;
        limit: number;
        skip: number;
    };
}

interface ProductFilters {
    page?: number;
    limit?: number;
    gender?: string;
    category?: string;
    sortBy?: string;
    search?: string;
    priceRange?: [number, number];
}

export function useProducts(filters: ProductFilters) {
    const [products, setProducts] = useState<Product[]>([]);
    const [metadata, setMetadata] = useState({ totalCount: 0, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { store } = useStore();

    useEffect(() => {
        async function fetchProducts() {
            if (!store.id) return;

            try {
                setLoading(true);

                const params: Record<string, string | number | undefined> = {
                    business: store.id,
                };

                if (filters.limit) params.limit = filters.limit;
                if (filters.page) params.p = filters.page;
                if (filters.gender) params.gender = filters.gender;
                if (filters.category) params.category = filters.category;
                if (filters.search) params.search = filters.search;
                if (filters.sortBy) params.sort = filters.sortBy;
                if (filters.priceRange) {
                    params.priceMin = filters.priceRange[0];
                    params.priceMax = filters.priceRange[1];
                }

                const response = await fetch(
                    `/api/stores/${store.id}/products?${new URLSearchParams(
                        params as any
                    ).toString()}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data: ProductsResponse = await response.json();

                if (data.status === "ok") {
                    setProducts(data.data.results || []);
                    setMetadata(data.data.metadata || { totalCount: 0, totalPages: 1 });
                } else {
                    throw new Error("API returned error status");
                }
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Failed to fetch products"
                );
                setProducts([]);
                setMetadata({ totalCount: 0, totalPages: 1 });
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [
        store.id,
        filters.page,
        filters.limit,
        filters.gender,
        filters.category,
        filters.search,
        filters.sortBy,
        filters.priceRange,
    ]);

    return { products, metadata, loading, error };
}


export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { store } = useStore();

    useEffect(() => {
        async function fetchCategories() {
            try {
                setLoading(true);

                const response = await fetch(`/api/stores/${store.id}/categories`);

                if (!response.ok) {
                    throw new Error("Failed to fetch categories");
                }

                const data: CategoriesResponse = await response.json();

                if (data.status === "ok") {
                    setCategories(data.data.results || []);
                } else {
                    throw new Error("API returned error status");
                }
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Failed to fetch categories"
                );
                setCategories([]);
            } finally {
                setLoading(false);
            }
        }

        if (store.id) {
            fetchCategories();
        }
    }, [store.id]);

    return { categories, loading, error };
}

export function useCollections() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { store } = useStore();

    useEffect(() => {
        async function fetchCollections() {
            try {
                setLoading(true);

                const response = await fetch(`/api/stores/${store.id}/collections`);

                if (!response.ok) {
                    throw new Error("Failed to fetch collections");
                }

                const data: CollectionsResponse = await response.json();

                if (data.status === "ok") {
                    setCollections(data.data.results || []);
                } else {
                    throw new Error("API returned error status");
                }
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Failed to fetch collections"
                );
                setCollections([]);
            } finally {
                setLoading(false);
            }
        }

        if (store.id) {
            fetchCollections();
        }
    }, [store.id]);

    return { collections, loading, error };
}

export function getProductImage(product: Product): string {
    if (product.variants && product.variants.length > 0) {
        const firstVariant = product.variants[0];
        if (firstVariant.gallery && firstVariant.gallery.length > 0) {
            return firstVariant.gallery[0]?.url;
        }
    }
    return "/placeholder-product.jpg";
}

export function getProductPrice(product: Product): number {
    return parseFloat(product.basePrice.value);
}

export function isProductInStock(product: Product): boolean {
    return product.stockStatus === "in-stock";
}

export function getCategoryImage(category: Category): string {
    if (category.gallery && category.gallery.length > 0) {
        return category.gallery[0];
    }
    return "/placeholder-category.jpg";
}