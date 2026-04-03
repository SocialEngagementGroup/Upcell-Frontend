import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../../../../utilities/axiosInstance';
import { useSearchParams } from 'react-router-dom';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SingleProductGroup from '../AdminSingleProduct/SingleProductGroup';

const familyOrder = ['iPhone', 'iPad', 'MacBook'];

const inferFamily = (productName = '', categoryName = '') => {
    const text = `${productName} ${categoryName}`.toLowerCase();
    if (text.includes('iphone')) return 'iPhone';
    if (text.includes('ipad')) return 'iPad';
    if (text.includes('macbook')) return 'MacBook';
    return '';
};

const AllProduct = () => {
    const [productGroups, setProductGroups] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category');

    const sortByProductName = (left, right) => {
        const leftFamily = inferFamily(left.productName, left.categoryName);
        const rightFamily = inferFamily(right.productName, right.categoryName);
        const leftFamilyIndex = familyOrder.indexOf(leftFamily);
        const rightFamilyIndex = familyOrder.indexOf(rightFamily);

        if (leftFamilyIndex !== rightFamilyIndex) {
            if (leftFamilyIndex === -1) return 1;
            if (rightFamilyIndex === -1) return -1;
            return leftFamilyIndex - rightFamilyIndex;
        }

        return right.productName.localeCompare(left.productName, undefined, { numeric: true, sensitivity: 'base' });
    };

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
            })).sort(sortByProductName);

            setProductGroups(grouped);
        }).catch((error) => console.log(error));
    }, []);

    const filteredProducts = useMemo(() => {
        const normalizedSearch = searchQuery.trim().toLowerCase();
        const categoryScoped = categoryFilter
            ? productGroups.filter((product) => product.categoryName === categoryFilter)
            : productGroups;

        return categoryScoped
            .filter((product) => {
                if (!normalizedSearch) return true;
                const searchableText = `${product.productName || ''} ${product.categoryName || ''}`.toLowerCase();
                return searchableText.includes(normalizedSearch);
            })
            .sort(sortByProductName);
    }, [categoryFilter, productGroups, searchQuery]);

    return (
        <section className="space-y-6">
            <div className="admin-panel rounded-[36px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10">
                <span className="eyebrow mb-5">Products</span>
                <h1 className="text-[clamp(2rem,3.8vw,3.6rem)] leading-[0.94]">
                    {categoryFilter ? `${categoryFilter} inventory.` : "Manage product inventory."}
                </h1>
                <label className="relative mt-6 block w-full">
                    <SearchRoundedIcon className="pointer-events-none absolute left-4 top-1/2 !text-[20px] -translate-y-1/2 text-apple-gray" />
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search inventory"
                        className="h-12 w-full rounded-full border border-black/[0.08] bg-white pl-12 pr-4 text-sm font-semibold text-apple-text outline-none transition-all placeholder:font-medium placeholder:text-apple-gray focus:border-apple-text/20 focus:shadow-[0_0_0_4px_rgba(29,29,31,0.05)]"
                    />
                </label>
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
