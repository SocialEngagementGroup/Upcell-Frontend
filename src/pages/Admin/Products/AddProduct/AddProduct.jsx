import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import ProductBatchForm from '../../../../components/ProductForm/ProductBatchForm';
import axiosInstance from '../../../../utilities/axiosInstance';
import { clearProductCache } from '../../../../utilities/catalog';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

const buildGroupedProduct = (parent, variants = []) => ({
    parentId: parent._id,
    productName: parent.modelName,
    categoryId: parent.categoryId || '',
    categoryName: parent.categoryName || '',
    images: parent.images || [],
    variants: variants.map((variant) => ({
        storage: variant.storage || '',
        colorName: variant.color?.name || '',
        colorValue: variant.color?.value || variant.color?.hex || '#000000',
        price: variant.price ?? '',
        discountPrice: variant.discountPrice ?? '',
        originalPrice: variant.originalPrice ?? '',
        outOfStock: Boolean(variant.outOfStock),
    })),
});

const mergeGroupedProducts = (current, incoming) => {
    const merged = new Map(incoming.map((product) => [product.parentId, product]));
    current.forEach((product) => {
        if (!merged.has(product.parentId)) merged.set(product.parentId, product);
    });
    return Array.from(merged.values());
};

const AddProduct = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const [allCatagories, setCatagories] = useState([]);
    const [existingProducts, setExistingProducts] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const initialProductName = searchParams.get('product') || '';
    const initialCategoryId = searchParams.get('categoryId') || '';
    const initialParentId = searchParams.get('parentId') || '';
    const [loadingEditTarget, setLoadingEditTarget] = useState(Boolean(initialParentId));

    // Fast path for "Edit product": fetch only the one product being edited
    // instead of waiting on the full catalog scan below, which can take a
    // long time on the current shared/free-tier database.
    useEffect(() => {
        if (!initialParentId) return;

        Promise.allSettled([
            axiosInstance.get(`catagory/${initialParentId}`),
            axiosInstance.get(`allSameParentProducts/${initialParentId}`),
        ])
            .then(([parentResult, variantResult]) => {
                if (parentResult.status === "fulfilled" && variantResult.status === "fulfilled") {
                    const grouped = buildGroupedProduct(parentResult.value.data, variantResult.value.data);
                    setExistingProducts((current) => mergeGroupedProducts(current, [grouped]));
                } else {
                    if (parentResult.status === "rejected") console.log(parentResult.reason);
                    if (variantResult.status === "rejected") console.log(variantResult.reason);
                    toast.error("Failed to load this product's details");
                }
            })
            .finally(() => setLoadingEditTarget(false));
    }, [initialParentId]);

    useEffect(() => {
        Promise.allSettled([
            axiosInstance.get("shop-categories"),
            axiosInstance.get("catagory"),
            axiosInstance.get("product"),
        ])
            .then(([categoryResult, parentResult, productResult]) => {
                if (categoryResult.status === "fulfilled") {
                    setCatagories(categoryResult.value.data);
                } else {
                    console.log(categoryResult.reason);
                    toast.error("Failed to load categories");
                }

                if (parentResult.status === "fulfilled" && productResult.status === "fulfilled") {
                    const groupedProducts = parentResult.value.data.map((parent) => (
                        buildGroupedProduct(
                            parent,
                            productResult.value.data.filter((variant) => String(variant.parentCatagory) === String(parent._id))
                        )
                    ));

                    setExistingProducts((current) => mergeGroupedProducts(current, groupedProducts));
                } else {
                    if (parentResult.status === "rejected") console.log(parentResult.reason);
                    if (productResult.status === "rejected") console.log(productResult.reason);
                    toast.error("Failed to load existing products");
                }
            });
    }, []);

    async function handleCreateCategory(payload) {
        const result = await axiosInstance.post("shop-categories", payload);
        setCatagories((current) => {
            const next = [...current.filter((category) => category._id !== result.data._id), result.data];
            return next.sort((left, right) => left.modelName.localeCompare(right.modelName));
        });
        clearProductCache();
        toast.success("Category created");
        return result.data;
    }

    async function handleSubmit(payload) {
        setSubmitting(true);
        try {
            const result = await axiosInstance.post("product", payload);
            const savedParent = result.data.parent;
            const savedVariants = result.data.variants || [];

            setExistingProducts((current) => {
                const next = current.filter((product) => product.parentId !== savedParent._id);
                next.push(buildGroupedProduct(savedParent, savedVariants));
                return next.sort((left, right) => left.productName.localeCompare(right.productName));
            });

            clearProductCache();
            // The Admin product list (AllProduct.jsx) reads from these React Query
            // cache keys with a 30s staleTime — without invalidating them here, a
            // save looks like it "did nothing" if you go back to the list right away.
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
            toast.success(result.status === 200 ? "Product updated" : "Product added");
            setSearchParams({});
        } catch (error) {
            console.log(error);
            toast.error("Failed to save product");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="space-y-6">
            <div className="admin-panel rounded-[36px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10">
                <span className="eyebrow mb-5">{initialParentId ? 'Edit Product' : 'Add Product'}</span>
                <h1 className="text-[clamp(2rem,3.8vw,3.6rem)] leading-[0.94]">
                    {loadingEditTarget
                        ? `Loading ${initialProductName || 'product'} details…`
                        : editingProduct
                            ? `Editing ${editingProduct.productName}.`
                            : 'Create a new product listing.'}
                </h1>
            </div>

            <div className="admin-panel rounded-[36px] p-6 md:p-7 xl:p-8">
                <ProductBatchForm
                    categories={allCatagories}
                    existingProducts={existingProducts}
                    initialProductName={initialProductName}
                    initialCategoryId={initialCategoryId}
                    initialParentId={initialParentId}
                    onCreateCategory={handleCreateCategory}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                    onEditingProductChange={setEditingProduct}
                />
            </div>
        </section>
    );
};

export default AddProduct;
