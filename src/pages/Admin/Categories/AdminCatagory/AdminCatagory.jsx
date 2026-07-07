import React, { useMemo, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader/AdminPageHeader';
import SearchWithSuggestions from '../../../../components/SearchWithSuggestions/SearchWithSuggestions';
import { useShopCategoriesQuery } from '../../../../queries/categories';
import { EMPTY_ARRAY } from '../../../../queries/keys';

const AdminCatagory = () => {
    const navigate = useNavigate();
    const [categorySearchQuery, setCategorySearchQuery] = useState('');
    const { data: shopCategories = EMPTY_ARRAY, isLoading } = useShopCategoriesQuery();

    const suggestions = useMemo(() => {
        const term = categorySearchQuery.trim().toLowerCase();
        if (!term) return [];
        return shopCategories
            .filter((category) => (category.modelName || '').toLowerCase().includes(term))
            .slice(0, 8);
    }, [shopCategories, categorySearchQuery]);

    return (
        <section className="space-y-6">
            <AdminPageHeader
                eyebrow="Categories"
                title="Organize product families."
                description="Keep storefront groupings clean, searchable, and ready for merchandising updates."
            />

            <div className="admin-panel rounded-[32px] p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap gap-3">
                        <NavLink
                            to=""
                            end
                            className={({ isActive }) => `rounded-full px-5 py-3 text-sm font-bold ${isActive ? 'bg-apple-text text-white' : 'bg-surface-alt text-apple-text'}`}
                        >
                            All categories
                        </NavLink>
                        <NavLink
                            to="addcatagory"
                            className={({ isActive }) => `rounded-full px-5 py-3 text-sm font-bold ${isActive ? 'bg-apple-text text-white' : 'bg-surface-alt text-apple-text'}`}
                        >
                            Add category
                        </NavLink>
                    </div>

                    <div className="w-full lg:max-w-[380px]">
                        <SearchWithSuggestions
                            value={categorySearchQuery}
                            onChange={setCategorySearchQuery}
                            placeholder="Search categories"
                            suggestions={suggestions}
                            isLoading={isLoading}
                            onSelect={(category) => {
                                setCategorySearchQuery(category.modelName);
                                navigate('');
                            }}
                            getSuggestionKey={(category) => category._id}
                            renderSuggestion={(category, focused) => (
                                <>
                                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] transition-colors ${focused ? 'bg-white/20' : 'bg-surface-alt group-hover:bg-white/20'}`}>
                                        {category.images?.[0]?.url && (
                                            <img src={category.images[0].url} alt={category.modelName} className="max-h-[80%] w-auto object-contain" />
                                        )}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className={`block truncate text-sm font-bold ${focused ? 'text-white' : 'text-apple-text'}`}>{category.modelName}</span>
                                        {category.description && (
                                            <span className={`block truncate text-xs ${focused ? 'text-white/80' : 'text-apple-gray'}`}>{category.description}</span>
                                        )}
                                    </span>
                                </>
                            )}
                        />
                    </div>
                </div>
            </div>
            <Outlet context={{ categorySearchQuery, setCategorySearchQuery }} />
        </section>
    );
};

export default AdminCatagory;
