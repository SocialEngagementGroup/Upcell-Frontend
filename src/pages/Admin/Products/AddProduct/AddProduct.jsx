import { useMemo, useState } from 'react';
import ProductBatchForm from '../../../../components/ProductForm/ProductBatchForm';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import {
    useProductsByParentQuery,
    useProductsQuery,
    useSaveProductMutation,
} from '../../../../queries/products';
import {
    useParentCategoriesQuery,
    useParentCategoryQuery,
    useShopCategoriesQuery,
    useCreateShopCategoryMutation,
} from '../../../../queries/categories';
import { EMPTY_ARRAY } from '../../../../queries/keys';

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

// `overrides` wins on matching parentId (used for the edit fast-path result,
// which is fresher/more targeted than the full-catalog list it's merged into).
const mergeGroupedProducts = (base, overrides) => {
    const merged = new Map(overrides.map((product) => [product.parentId, product]));
    base.forEach((product) => {
        if (!merged.has(product.parentId)) merged.set(product.parentId, product);
    });
    return Array.from(merged.values());
};

const AddProduct = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [editingProduct, setEditingProduct] = useState(null);
    const initialProductName = searchParams.get('product') || '';
    const initialCategoryId = searchParams.get('categoryId') || '';
    const initialParentId = searchParams.get('parentId') || '';

    const { data: shopCategories = EMPTY_ARRAY } = useShopCategoriesQuery();
    const { data: parents = EMPTY_ARRAY } = useParentCategoriesQuery();
    const { data: variants = EMPTY_ARRAY } = useProductsQuery();

    // Fast path for "Edit product": fetch only the one product being edited
    // instead of waiting on the full catalog scan above, which can take a
    // long time on the current shared/free-tier database.
    const { data: editParent, isLoading: editParentLoading } = useParentCategoryQuery(initialParentId);
    const { data: editVariants, isLoading: editVariantsLoading } = useProductsByParentQuery(initialParentId);
    const loadingEditTarget = Boolean(initialParentId) && !editParent && (editParentLoading || editVariantsLoading);

    const existingProducts = useMemo(() => {
        const fullList = parents.map((parent) => buildGroupedProduct(
            parent,
            variants.filter((variant) => String(variant.parentCatagory) === String(parent._id))
        ));

        if (editParent) {
            return mergeGroupedProducts(fullList, [buildGroupedProduct(editParent, editVariants || [])]);
        }

        return fullList;
    }, [parents, variants, editParent, editVariants]);

    const createCategory = useCreateShopCategoryMutation();
    const saveProduct = useSaveProductMutation();

    async function handleCreateCategory(payload) {
        const created = await createCategory.mutateAsync(payload);
        toast.success("Category created");
        return created;
    }

    async function handleSubmit(payload) {
        try {
            const result = await saveProduct.mutateAsync(payload);
            toast.success(result.status === 200 ? "Product updated" : "Product added");
            setSearchParams({});
        } catch (error) {
            console.log(error);
            toast.error("Failed to save product");
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
                    categories={shopCategories}
                    existingProducts={existingProducts}
                    initialProductName={initialProductName}
                    initialCategoryId={initialCategoryId}
                    initialParentId={initialParentId}
                    onCreateCategory={handleCreateCategory}
                    onSubmit={handleSubmit}
                    submitting={saveProduct.isPending}
                    onEditingProductChange={setEditingProduct}
                />
            </div>
        </section>
    );
};

export default AddProduct;
