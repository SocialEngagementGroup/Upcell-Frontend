import React from 'react';
import { Link } from 'react-router-dom';

const ModernHero = () => {
    return (
        <section className="bg-[radial-gradient(circle_at_top_right,#111_0%,#000_100%)] py-24 overflow-hidden text-white">
            <div className="max-w-site mx-auto px-[100px] lg:px-10 flex items-center justify-between gap-[60px] max-lg:flex-col max-lg:text-center">
                <div className="flex-[1.2] max-w-[650px] animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)] max-lg:max-w-full max-lg:flex max-lg:flex-col max-lg:items-center">
                    <h1 className="text-[clamp(40px,6vw,72px)] leading-[1.05] font-extrabold text-white mb-7 tracking-[-0.04em]">
                        The Future of <br />
                        iPhone. Today.
                    </h1>
                    <p className="text-xl leading-relaxed text-[#a1a1a1] mb-12 max-w-[520px] font-normal max-lg:mx-auto">
                        Experience the raw power of the titanium-forged iPhone 15 Pro. 
                        Trade in your old device and step into the next era of mobile technology.
                    </p>
                    <div className="flex gap-4">
                        <Link to="/shop" className="bg-brand-red !text-white px-10 py-[18px] rounded-xl text-base font-bold transition-all duration-300 ease-smooth hover:bg-brand-red-hover hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(214,0,28,0.2)]">Shop Now</Link>
                        <Link to="/sell-your-device" className="bg-apple-text border border-[#333] !text-white px-10 py-[18px] rounded-xl text-base font-bold transition-all duration-300 ease-smooth hover:bg-[#2a2a2c] hover:border-[#555] hover:-translate-y-0.5">Sell Your Device</Link>
                    </div>
                </div>
                <div className="flex-1 relative flex justify-center items-center animate-[fadeInRight_1s_cubic-bezier(0.16,1,0.3,1)] max-lg:mt-10">
                    <img src="/staticImages/hero-iphone15.png" alt="iPhone 15 Pro Titanium" className="w-full max-w-[550px] h-auto object-contain z-[2] drop-shadow-[0_0_40px_rgba(255,255,255,0.05)] [transform:perspective(1000px)_rotateY(-5deg)]" />
                </div>
            </div>
        </section>
    );
};

export default ModernHero;
