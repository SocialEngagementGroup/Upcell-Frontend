import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utilities/axiosInstance';
import { groupProductsByParent, normalizeProduct } from '../../utilities/catalog';
import ModernProductCard from '../ModernProductCard/ModernProductCard';

const sortByLatestProductName = (left, right) => (
    right.productName.localeCompare(left.productName, undefined, { numeric: true, sensitivity: 'base' })
);

const FeaturedUnits = () => {
    const [categories, setCategories] = useState({
        iPhone: [],
        iPad: [],
        MacBook: []
    });

    useEffect(() => {
        axiosInstance.get('product')
            .then((res) => {
                const normalized = groupProductsByParent(res.data.map(normalizeProduct));
                const iphones = normalized
                    .filter((p) => p.family === 'iPhone')
                    .sort(sortByLatestProductName)
                    .slice(0, 4);
                const ipads = normalized
                    .filter((p) => p.family === 'iPad')
                    .sort(sortByLatestProductName)
                    .slice(0, 4);
                const macbooks = normalized
                    .filter((p) => p.family === 'MacBook')
                    .sort(sortByLatestProductName)
                    .slice(0, 4);

                setCategories({
                    iPhone: iphones,
                    iPad: ipads,
                    MacBook: macbooks
                });
            })
            .catch((error) => console.log(error));
    }, []);

    const categoryConfig = [
        { key: 'iPhone', title: 'Handpicked iPhones' },
        { key: 'iPad', title: 'Selected iPads' },
        { key: 'MacBook', title: 'Premium MacBooks' }
    ];

    return (
        <section className="px-4 py-14 md:px-6 md:py-24">
            <div className="page-container">
                <div className="mb-20 flex flex-col items-center justify-center text-center">
                    <h2 className="tracking-[-0.01em]">Handpicked <br className="hidden md:block" /> For Your Choice.</h2>
                </div>
                
                <div className="space-y-24">
                    {categoryConfig.map(cat => categories[cat.key].length > 0 && (
                        <div key={cat.key}>
                            <div className="mb-10 flex items-center justify-between border-b border-apple-gray/5 pb-6">
                                <h3 className="text-3xl font-black tracking-tight">{cat.title}</h3>
                                <Link to={`/shop?category=${cat.key.toLowerCase()}`} className="text-sm font-bold text-apple-gray hover:text-apple-text transition-colors">
                                    View Full {cat.key} Range →
                                </Link>
                            </div>
                            <div className="grid grid-cols-4 gap-6 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
                                {categories[cat.key].map(product => (
                                    <ModernProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-24 flex justify-center">
                    <Link 
                        to="/shop" 
                        className="premium-button min-w-[240px]"
                    >
                        Explore Full Collection
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedUnits;
