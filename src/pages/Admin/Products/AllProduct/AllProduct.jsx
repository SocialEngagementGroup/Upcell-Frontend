import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../../../../utilities/axiosInstance';
import { useSearchParams } from 'react-router-dom';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SingleProductGroup from '../AdminSingleProduct/SingleProductGroup';
import AdminPageHeader from '../../../../components/AdminPageHeader/AdminPageHeader';
import AdminStatsGrid from '../../../../components/AdminStatsGrid/AdminStatsGrid';
import AdminLoadingState from '../../../../components/AdminState/AdminLoadingState';
import AdminEmptyState from '../../../../components/AdminState/AdminEmptyState';

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
    const [isLoading, setIsLoading] = useState(true);
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
        setIsLoading(true);
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
        }).catch((error) => console.log(error))
            .finally(() => setIsLoading(false));
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

    const totalVariants = filteredProducts.reduce((sum, product) => sum + product.variants.length, 0);
    const stats = [
        { label: 'Visible families', value: filteredProducts.length, sub: 'matching the current product view' },
        { label: 'Saved families', value: productGroups.length, sub: 'total product groups in admin' },
        { label: 'Visible variants', value: totalVariants, sub: 'items currently represented in this view' },
        { label: 'Category scope', value: categoryFilter || 'All', sub: 'active inventory filter' },
    ];

    return (
        <section className="space-y-6">
            <AdminPageHeader
                eyebrow="Products"
                title={categoryFilter ? `${categoryFilter} inventory.` : "Manage product inventory."}
                description="Search, adjust, and clean up product families without leaving the admin workspace."
            >
                <label className="relative block w-full">
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
            </AdminPageHeader>

            <AdminStatsGrid items={stats} />

            {isLoading ? (
                <AdminLoadingState title="Loading inventory" description="Gathering product families and variant data for the admin inventory view." />
            ) : filteredProducts.length ? (
                <div className="space-y-5">
                    {filteredProducts.map((product) => (
                        <SingleProductGroup
                            key={product.parentId}
                            productGroup={product}
                            onDelete={(parentId) => setProductGroups((current) => current.filter((item) => item.parentId !== parentId))}
                        />
                    ))}
                </div>
            ) : (
                <AdminEmptyState title="No products found." description="Try another search or clear the category filter to see more inventory." />
            )}
        </section>
    );
};

export default AllProduct;
