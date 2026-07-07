import React from 'react';
import { Link } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const ModernProductCard = ({ product }) => {
    // If productId/parentId are already strings in the props, use them. 
    // If we're passing the raw API object, we map them.
    const parentId = product.parentId || product.parentCatagory;
    const productId = product.productId || product._id;
    const title = product.title || product.productName;
    const family = product.family;
    const image = product.image;
    const price = product.price.toString().startsWith('$') ? product.price : `$${product.price}`;
    const availableColors = product.availableColors || [];

    return (
        <Link
            to={`/iphone/${parentId}/${productId}`}
            className="group relative block overflow-hidden rounded-[24px] border border-black/[0.08] bg-white transition-all duration-500 hover:-translate-y-2 hover:border-brand-red hover:shadow-[0_14px_36px_rgba(217,11,15,0.15)]"
        >
            <div className="relative flex h-[310px] items-center justify-center overflow-hidden">
                <img src={image} alt={title} className="max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-700 group-hover:scale-105" />

                <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-brand-red/80 text-white backdrop-blur-md transition-colors hover:bg-brand-red" onClick={(e) => e.preventDefault()}>
                        <CompareArrowsIcon className="!text-[20px]" />
                    </button>
                    <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-brand-red/80 text-white backdrop-blur-md transition-colors hover:bg-brand-red" onClick={(e) => e.preventDefault()}>
                        <FavoriteBorderIcon className="!text-[20px]" />
                    </button>
                </div>
            </div>

            <div className="p-5 pt-6">
                <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.24em] text-apple-gray/50">{family}</span>
                    <h3 className="text-[22px] font-extrabold text-apple-text leading-[1.2]">
                        {family === 'MacBook' && title.includes('(') ? (
                            <>
                                {title.split('(')[0].trim()}
                                <br />
                                ({title.split('(')[1]}
                            </>
                        ) : title}
                    </h3>
                    {availableColors.length > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            {availableColors.map((swatch) => (
                                <span
                                    key={swatch.name}
                                    className="h-5 w-5 rounded-full border-[1.5px] border-black/20"
                                    style={{ backgroundColor: swatch.value }}
                                    title={swatch.name}
                                    aria-label={swatch.name}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <div className="mb-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-apple-gray/65">
                            From
                        </div>
                        <span className="text-[26px] font-black leading-none text-apple-text">{price}</span>
                    </div>
                    <div className="group/link flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-brand-red px-3.5 py-2 text-sm font-bold text-white shadow-[0_10px_20px_rgba(217,11,15,0.25)] transition-all duration-300 group-hover:bg-[#b00a0d]">
                        View Product
                        <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ModernProductCard;
