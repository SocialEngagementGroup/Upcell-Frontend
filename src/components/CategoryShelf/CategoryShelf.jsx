import React from 'react';
import { Link } from 'react-router-dom';

const CategoryShelf = () => {
    return (
        <section className="py-[60px] bg-[#FAFAFA]">
            <div className="max-w-site mx-auto px-[100px] lg:px-10">
                <div className="grid grid-cols-2 gap-6 h-[700px] max-lg:grid-cols-1 max-lg:h-auto">
                    {/* Left Column - Large iPhone Card */}
                    <div className="bg-white rounded-[28px] overflow-hidden relative flex flex-col p-10 transition-all duration-[400ms] ease-bounce-out shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] col-start-1 h-full max-lg:h-[400px] max-lg:p-[30px]">
                        <div>
                            <h3 className="text-[32px] font-extrabold text-apple-text mb-2 tracking-[-0.02em] max-lg:text-[28px]">iPhone</h3>
                            <p className="text-base text-apple-gray mb-10 max-w-[200px] leading-[1.4]">The world's most powerful personal device.</p>
                            <Link to="/shop?category=iphone" className="text-base font-semibold text-brand-red no-underline transition-opacity duration-200 hover:opacity-70">
                                Explore All <span>→</span>
                            </Link>
                        </div>
                        <div className="absolute w-[60%] -bottom-[5%] -right-[5%] z-[1] max-lg:!w-[45%] max-lg:!bottom-[5%] max-lg:!right-[5%]">
                            <img src="/staticImages/category-iphone.png" alt="iPhone Category" className="w-full h-auto object-contain" />
                        </div>
                    </div>

                    {/* Right Column - iPad & MacBook Stack */}
                    <div className="flex flex-col h-full gap-6">
                        {/* iPad Card */}
                        <div className="bg-white rounded-[28px] overflow-hidden relative flex flex-col p-10 transition-all duration-[400ms] ease-bounce-out shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] flex-1 max-lg:h-[400px] max-lg:p-[30px]">
                            <div>
                                <h3 className="text-[32px] font-extrabold text-apple-text mb-2 tracking-[-0.02em] max-lg:text-[28px]">iPad</h3>
                                <p className="text-base text-apple-gray mb-10 max-w-[200px] leading-[1.4]">Versatility meets portability.</p>
                                <Link to="/shop?category=ipad" className="text-base font-semibold text-brand-red no-underline transition-opacity duration-200 hover:opacity-70">Shop iPad</Link>
                            </div>
                            <div className="absolute w-[50%] top-1/2 right-[5%] -translate-y-[40%] z-[1] max-lg:!w-[45%] max-lg:!bottom-[5%] max-lg:!right-[5%] max-lg:!top-auto max-lg:!translate-y-0">
                                <img src="/staticImages/category-ipad.png" alt="iPad Category" className="w-full h-auto object-contain" />
                            </div>
                        </div>

                        {/* MacBook Card (Dark Theme) */}
                        <div className="bg-black rounded-[28px] overflow-hidden relative flex flex-col p-10 transition-all duration-[400ms] ease-bounce-out shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] flex-1 max-lg:h-[400px] max-lg:p-[30px]">
                            <div>
                                <h3 className="text-[32px] font-extrabold text-white mb-2 tracking-[-0.02em] max-lg:text-[28px]">MacBook</h3>
                                <p className="text-base text-apple-gray mb-10 max-w-[200px] leading-[1.4]">Mind-blowing power. Heart-stopping speed.</p>
                                <Link to="/shop?category=macbook" className="text-base font-semibold text-brand-red no-underline transition-opacity duration-200 hover:opacity-70">Shop Mac</Link>
                            </div>
                            <div className="absolute w-[60%] bottom-[5%] -right-[5%] z-[1] max-lg:!w-[45%] max-lg:!bottom-[5%] max-lg:!right-[5%]">
                                <img src="/staticImages/category-macbook.png" alt="MacBook Category" className="w-full h-auto object-contain" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoryShelf;
