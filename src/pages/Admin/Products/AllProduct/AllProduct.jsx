import { useEffect, useState } from 'react';
import axiosInstance from '../../../../utilities/axiosInstance';
import { useSearchParams } from 'react-router-dom';
import SingleProductGroup from '../AdminSingleProduct/SingleProductGroup';

const AllProduct = () => {
    const [productGroups, setProductGroups] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category');

    useEffect(() => {
        Promise.all([
            axiosInstance.get('catagory'),
            axiosInstance.get('product'),
        ]).then(([parentResult, productResult]) => {
            const grouped = parentResult.data.map((parent) => ({
                parentId: parent._id,
                productName: parent.modelName,
                categoryName: parent.categoryName || '',
                image: parent.images?.[0]?.url || '',
                variants: productResult.data.filter((variant) => String(variant.parentCatagory) === String(parent._id)),
            }));

            setProductGroups(grouped);
        }).catch((error) => console.log(error));
    }, []);

    const filteredProducts = categoryFilter
        ? productGroups.filter((product) => product.categoryName === categoryFilter)
        : productGroups;

    return (
        <section className="space-y-6">
            <div className="admin-panel rounded-[36px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10">
                <span className="eyebrow mb-5">Products</span>
                <h1 className="text-[clamp(2rem,3.8vw,3.6rem)] leading-[0.94]">
                    {categoryFilter ? `${categoryFilter} inventory.` : "Manage product inventory."}
                </h1>
                <p className="mt-4 text-base leading-8 text-ink-soft">
                    {categoryFilter 
                        ? `Viewing all listings for ${categoryFilter}.` 
                        : "Review every listing, then edit or remove products without leaving the dashboard."
                    }
                </p>
                {categoryFilter && (
                    <button 
                        onClick={() => setSearchParams({})}
                        className="premium-button mt-6 h-12 py-0 px-6"
                    >
                        Clear filter
                    </button>
                )}
            </div>

            <div className="space-y-5">
                {filteredProducts.map((product) => (
                    <SingleProductGroup
                        key={product.parentId}
                        productGroup={product}
                        onDelete={(parentId) => setProductGroups((current) => current.filter((item) => item.parentId !== parentId))}
                    />
                ))}
            </div>
            
            {filteredProducts.length === 0 && (
                <div className="admin-panel rounded-[30px] p-12 text-center">
                    <p className="text-xl text-ink-soft font-medium">No products found.</p>
                </div>
            )}
        </section>
    );
};

export default AllProduct;
