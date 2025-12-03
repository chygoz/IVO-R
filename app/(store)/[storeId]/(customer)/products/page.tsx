"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import {
  useProducts,
  useCategories,
  getProductImage,
  getProductPrice,
  isProductInStock,
} from "@/hooks/use-paginated-products";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchParams, usePathname } from "next/navigation";

interface FilterState {
  category: string;
  gender: string;
  priceRange: [number, number];
  sortBy: "name" | "price-low" | "price-high" | "newest";
  search: string;
}

export default function ProductsPage() {
  const { store, storeId } = useStore();
  const { colors } = store;
  const pathname = usePathname();
  const isPathBased = pathname?.startsWith(`/${storeId}`);
  const base = isPathBased ? `/${storeId}` : "";

  const [filters, setFilters] = useState<FilterState>({
    category: "",
    gender: "",
    priceRange: [0, 1000000],
    sortBy: "newest",
    search: "",
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const categoryParam = useSearchParams().get("category");
  const { products, metadata, loading } = useProducts({
    ...filters,
    search: debouncedSearch,
    page: currentPage,
    limit: itemsPerPage,
  });

  const { categories } = useCategories();

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      gender: "",
      priceRange: [0, 1000000],
      sortBy: "newest",
      search: "",
    });
    setCurrentPage(1);
  };
  useEffect(() => {
    if (typeof categoryParam == "string" && categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    }
  }, [categoryParam, categories])
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      <section className="py-12" style={{ backgroundColor: colors.primary }}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1
              className="text-4xl md:text-5xl font-bold uppercase mb-4"
              style={{ color: colors.background }}
            >
              Our Products
            </h1>
            <p
              className="text-xl opacity-80"
              style={{ color: colors.background }}
            >
              Discover our complete collection
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <div className="sticky top-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-full mb-4 px-4 py-2 rounded-lg font-medium"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                }}
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>

              <AnimatePresence>
                {(showFilters || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6 overflow-hidden"
                  >
                    <div>
                      <h3
                        className="font-bold mb-3"
                        style={{ color: colors.text }}
                      >
                        Search
                      </h3>
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={filters.search}
                        onChange={(e) => updateFilter("search", e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                        style={{ borderColor: `${colors.primary}30` }}
                      />
                    </div>

                    <div>
                      <h3
                        className="font-bold mb-3"
                        style={{ color: colors.text }}
                      >
                        Categories
                      </h3>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="category"
                            value=""
                            checked={filters.category === ""}
                            onChange={(e) =>
                              updateFilter("category", e.target.value)
                            }
                            className="mr-2"
                          />
                          All Categories
                        </label>
                        {categories.map((category) => (
                          <label
                            key={category._id}
                            className="flex items-center"
                          >
                            <input
                              type="radio"
                              name="category"
                              value={category.slug}
                              checked={filters.category === category.slug}
                              onChange={(e) =>
                                updateFilter("category", e.target.value)
                              }
                              className="mr-2"
                            />
                            {category.name}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3
                        className="font-bold mb-3"
                        style={{ color: colors.text }}
                      >
                        Gender
                      </h3>
                      <div className="space-y-2">
                        {["", "men", "women", "unisex"].map((gender) => (
                          <label key={gender} className="flex items-center">
                            <input
                              type="radio"
                              name="gender"
                              value={gender}
                              checked={filters.gender === gender}
                              onChange={(e) =>
                                updateFilter("gender", e.target.value)
                              }
                              className="mr-2"
                            />
                            {gender === ""
                              ? "All"
                              : gender.charAt(0).toUpperCase() +
                              gender.slice(1)}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3
                        className="font-bold mb-3"
                        style={{ color: colors.text }}
                      >
                        Price Range
                      </h3>
                      <div className="space-y-3">
                        <input
                          type="range"
                          min="0"
                          max="1000000"
                          step="10000"
                          value={filters.priceRange[1]}
                          onChange={(e) =>
                            updateFilter("priceRange", [
                              0,
                              parseInt(e.target.value),
                            ])
                          }
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm">
                          <span>₦0</span>
                          <span>₦{filters.priceRange[1].toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2 border rounded-lg transition-colors"
                      style={{
                        borderColor: colors.primary,
                        color: colors.primary,
                      }}
                    >
                      Clear All Filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <p style={{ color: colors.text }}>
                {metadata.totalCount} product
                {metadata.totalCount !== 1 ? "s" : ""} found
              </p>

              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter("sortBy", e.target.value as any)}
                className="px-3 py-2 border rounded-lg focus:outline-none"
                style={{ borderColor: `${colors.primary}30` }}
              >
                <option value="newest">Newest First</option>
                <option value="name">Name A-Z</option>
                <option value="price-low">Price Low to High</option>
                <option value="price-high">Price High to Low</option>
              </select>
            </div>

            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array(itemsPerPage)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
              </div>
            )}

            {!loading && (
              <>
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 gap-y-4"
                  layout
                >
                  <AnimatePresence>
                    {products.map((product) => (
                      <motion.div
                        key={product._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="group"
                      >
                        <Link
                          href={`${base}/products/${product.slug}`}
                          className="block"
                        >
                          <div
                            style={{ backgroundColor: `#F0F0F0` }}
                            className="aspect-square relative overflow-hidden  mb-3"
                          >
                            <Image
                              src={getProductImage(product)}
                              alt={product.name}
                              fill
                              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {!isProductInStock(product) && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white font-bold">
                                  Out of Stock
                                </span>
                              </div>
                            )}
                            {product.mode === "on-sale" && (
                              <div
                                className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold"
                                style={{
                                  backgroundColor: colors.primary,
                                  color: colors.background,
                                }}
                              >
                                Sale
                              </div>
                            )}
                          </div>
                          <h3 className="text-sm capitalize group-hover:opacity-70 transition-opacity">
                            {product.name}
                          </h3>
                          {store.settings?.showPrices && (
                            <p className="" style={{ color: colors.text }}>
                              {product.basePrice.currency === "USD" ? "$" : "₦"}
                              {getProductPrice(product).toLocaleString()}
                            </p>
                          )}
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {metadata.totalPages > 1 && (
                  <div className="flex justify-center mt-12 space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="px-4 py-2 border rounded-lg disabled:opacity-50"
                      style={{ borderColor: colors.primary }}
                    >
                      Previous
                    </button>

                    {Array.from({ length: metadata.totalPages }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-4 py-2 border rounded-lg ${currentPage === index + 1 ? "font-bold" : ""
                          }`}
                        style={{
                          borderColor: colors.primary,
                          backgroundColor:
                            currentPage === index + 1
                              ? colors.primary
                              : "transparent",
                          color:
                            currentPage === index + 1
                              ? colors.background
                              : colors.primary,
                        }}
                      >
                        {index + 1}
                      </button>
                    ))}


                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(metadata.totalPages, currentPage + 1))
                      }
                      disabled={currentPage === metadata.totalPages}
                      className="px-4 py-2 border rounded-lg disabled:opacity-50"
                      style={{ borderColor: colors.primary }}
                    >
                      Next
                    </button>
                  </div>
                )}

                {products.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <h3
                      className="text-2xl font-bold mb-4"
                      style={{ color: colors.text }}
                    >
                      No products found
                    </h3>
                    <p className="mb-6 opacity-70">
                      Try adjusting your filters or search terms
                    </p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 rounded-lg font-medium"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.background,
                      }}
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
