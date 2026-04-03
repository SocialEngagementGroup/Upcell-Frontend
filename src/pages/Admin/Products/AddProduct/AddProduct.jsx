import { useEffect, useState } from 'react';
import ProductBatchForm from '../../../../components/ProductForm/ProductBatchForm';
import axiosInstance from '../../../../utilities/axiosInstance';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

const AddProduct = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [allCatagories, setCatagories] = useState([]);
    const [existingProducts, setExistingProducts] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const initialProductName = searchParams.get('product') || '';
    const initialCategoryId = searchParams.get('categoryId') || '';

    useEffect(() => {
        Promise.all([
            axiosInstance.get("shop-categories"),
            axiosInstance.get("catagory"),
            axiosInstance.get("product"),
        ])
            .then(([categoryResult, parentResult, productResult]) => {
                setCatagories(categoryResult.data);

                const groupedProducts = parentResult.data.map((parent) => ({
                    parentId: parent._id,
                    productName: parent.modelName,
                    categoryId: parent.categoryId || '',
                    categoryName: parent.categoryName || '',
                    images: parent.images || [],
                    variants: productResult.data
                        .filter((variant) => String(variant.parentCatagory) === String(parent._id))
                        .map((variant) => ({
                            storage: variant.storage || '',
                            colorName: variant.color?.name || '',
                            colorValue: variant.color?.value || variant.color?.hex || '#000000',
                            price: variant.price ?? '',
                            discountPrice: variant.discountPrice ?? '',
                            originalPrice: variant.originalPrice ?? '',
                            outOfStock: Boolean(variant.outOfStock),
                        })),
                }));

                setExistingProducts(groupedProducts);
            })
            .catch((error) => console.log(error));
    }, []);

    async function handleCreateCategory(payload) {
        const result = await axiosInstance.post("shop-categories", payload);
        setCatagories((current) => {
            const next = [...current.filter((category) => category._id !== result.data._id), result.data];
            return next.sort((left, right) => left.modelName.localeCompare(right.modelName));
        });
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
                next.push({
                    parentId: savedParent._id,
                    productName: savedParent.modelName,
                    categoryId: savedParent.categoryId || '',
                    categoryName: savedParent.categoryName || '',
                    images: savedParent.images || [],
                    variants: savedVariants.map((variant) => ({
                        storage: variant.storage || '',
                        colorName: variant.color?.name || '',
                        colorValue: variant.color?.value || variant.color?.hex || '#000000',
                        price: variant.price ?? '',
                        discountPrice: variant.discountPrice ?? '',
                        originalPrice: variant.originalPrice ?? '',
                        outOfStock: Boolean(variant.outOfStock),
                    })),
                });
                return next.sort((left, right) => left.productName.localeCompare(right.productName));
            });

            toast.success(result.status === 200 ? "Product updated" : "Product added");
            setSearchParams({});
        } catch (error) {
            console.log(error);
            alert("error happened !!");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="space-y-6">
            <div className="admin-panel rounded-[36px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10">
                <span className="eyebrow mb-5">Add Product</span>
                <h1 className="text-[clamp(2rem,3.8vw,3.6rem)] leading-[0.94]">Create a new product listing.</h1>
            </div>

            <div className="admin-panel rounded-[36px] p-6 md:p-7 xl:p-8">
                <ProductBatchForm
                    categories={allCatagories}
                    existingProducts={existingProducts}
                    initialProductName={initialProductName}
                    initialCategoryId={initialCategoryId}
                    onCreateCategory={handleCreateCategory}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                />
            </div>
        </section>
    );
};

export default AddProduct;
