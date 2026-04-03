import React, { useMemo, useState } from 'react';
import ScrollToTop from '../../utilities/ScrollToTop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import BoltIcon from '@mui/icons-material/Bolt';

const deviceOptions = [
    { id: 'iPhone', title: 'iPhone', desc: 'From iPhone 11 through the latest Pro models.' },
    { id: 'iPad', title: 'iPad', desc: 'Air, mini, and Pro models accepted.' },
    { id: 'MacBook', title: 'MacBook', desc: 'Portable Macs with strong resale value.' },
];

const conditionOptions = [
    { id: 'Mint', title: 'Mint', desc: 'Looks almost new with minimal visible wear.' },
    { id: 'Excellent', title: 'Excellent', desc: 'Light use, clean body, and fully functional.' },
    { id: 'Good', title: 'Good', desc: 'Visible wear but still dependable and complete.' },
    { id: 'Fair', title: 'Fair', desc: 'Heavier signs of use with reduced cosmetic value.' },
];

const TradeIn = () => {
    const [step, setStep] = useState(1);
    const [selection, setSelection] = useState({
        device: '',
        condition: '',
        name: '',
        email: '',
        phone: '',
    });

    const estimate = useMemo(() => {
        if (selection.device === 'iPhone' && selection.condition === 'Mint') return '$750';
        if (selection.device === 'iPhone') return '$520';
        if (selection.device === 'MacBook') return '$840';
        if (selection.device === 'iPad') return '$430';
        return '$0';
    }, [selection]);

    const next = () => setStep((prev) => Math.min(prev + 1, 4));

    return (
        <div className="page-shell">
            <ScrollToTop />

            <section className="page-container pb-10 pt-6">
                <div className="rounded-[40px] bg-[linear-gradient(135deg,#0f1012_0%,#1b1e24_55%,#2b3138_100%)] px-8 py-10 text-white shadow-medium md:px-12 md:py-14">
                    <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-white/60">Trade In</span>
                    <h1 className="mt-6 text-[clamp(2.8rem,5vw,5rem)] leading-[0.92] text-white">Upgrade the Apple way, starting with your current device.</h1>
                    <p className="mt-5 max-w-[680px] text-lg leading-8 text-white/72">
                        Get a fast valuation, prepaid shipping, and a quieter premium trade-in experience from start to finish.
                    </p>
                </div>
            </section>

            <section className="page-container pb-16">
                <div className="mb-8 flex flex-wrap gap-3">
                    {['Choose device', 'Condition', 'Your details', 'Confirmation'].map((label, index) => (
                        <div key={label} className={`rounded-full px-5 py-3 text-sm font-bold ${step === index + 1 ? 'bg-apple-text text-white' : 'border border-black/[0.08] bg-white text-apple-gray'}`}>
                            {index + 1}. {label}
                        </div>
                    ))}
                </div>

                {step === 1 && (
                    <div className="grid gap-6 lg:grid-cols-3">
                        {deviceOptions.map((device) => (
                            <button
                                key={device.id}
                                className="premium-card rounded-[32px] p-8 text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-medium"
                                onClick={() => {
                                    setSelection((prev) => ({ ...prev, device: device.id }));
                                    next();
                                }}
                            >
                                <div className="eyebrow mb-5">Device type</div>
                                <h2 className="text-[34px]">{device.title}</h2>
                                <p className="mt-3 text-base leading-8 text-ink-soft">{device.desc}</p>
                            </button>
                        ))}
                    </div>
                )}

                {step === 2 && (
                    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                        <div className="grid gap-6 md:grid-cols-2">
                            {conditionOptions.map((condition) => (
                                <button
                                    key={condition.id}
                                    className="premium-card rounded-[32px] p-8 text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-medium"
                                    onClick={() => {
                                        setSelection((prev) => ({ ...prev, condition: condition.id }));
                                        next();
                                    }}
                                >
                                    <div className="eyebrow mb-5">{selection.device || 'Apple device'}</div>
                                    <h2 className="text-[30px]">{condition.title}</h2>
                                    <p className="mt-3 text-base leading-8 text-ink-soft">{condition.desc}</p>
                                </button>
                            ))}
                        </div>
                        <aside className="premium-card h-fit rounded-[32px] p-6">
                            <h3 className="text-[28px]">Estimated value</h3>
                            <div className="mt-4 text-5xl font-extrabold text-apple-text">{estimate}</div>
                            <p className="mt-3 text-sm leading-7 text-ink-soft">Your final offer is confirmed after inspection, but this gives you a realistic premium-range estimate.</p>
                        </aside>
                    </div>
                )}

                {step === 3 && (
                    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                        <div className="premium-card rounded-[36px] p-8 md:p-10">
                            <h2 className="text-[36px]">Finalize your details</h2>
                            <p className="mt-3 text-base leading-8 text-ink-soft">We’ll use this to send your shipping kit and confirm your offer.</p>
                            <div className="mt-6 grid gap-4">
                                <input className="premium-input" placeholder="Full name" value={selection.name} onChange={(e) => setSelection((prev) => ({ ...prev, name: e.target.value }))} />
                                <input className="premium-input" placeholder="Email address" value={selection.email} onChange={(e) => setSelection((prev) => ({ ...prev, email: e.target.value }))} />
                                <input className="premium-input" placeholder="Phone number" value={selection.phone} onChange={(e) => setSelection((prev) => ({ ...prev, phone: e.target.value }))} />
                            </div>
                            <button className="premium-button mt-8" onClick={next}>Submit Trade-In Request</button>
                        </div>

                        <aside className="premium-card rounded-[32px] p-6">
                            <h3 className="text-[28px]">What’s included</h3>
                            <div className="mt-6 space-y-5">
                                <div className="flex gap-3"><SecurityIcon className="!text-[20px]" /><p className="text-sm leading-7 text-ink-soft">Secure device handling and guidance for wiping your data.</p></div>
                                <div className="flex gap-3"><LocalShippingOutlinedIcon className="!text-[20px]" /><p className="text-sm leading-7 text-ink-soft">Prepaid shipping materials and insured transit.</p></div>
                                <div className="flex gap-3"><BoltIcon className="!text-[20px]" /><p className="text-sm leading-7 text-ink-soft">Fast payouts once the condition is verified.</p></div>
                            </div>
                        </aside>
                    </div>
                )}

                {step === 4 && (
                    <div className="premium-card rounded-[36px] px-8 py-16 text-center">
                        <CheckCircleIcon className="!text-[72px] text-apple-text" />
                        <h2 className="mt-6 text-[42px]">Trade-in request received.</h2>
                        <p className="mx-auto mt-4 max-w-[560px] text-lg leading-8 text-ink-soft">
                            We’ll email the next steps, shipping instructions, and your inspection guidance shortly.
                        </p>
                        <div className="mt-8 flex justify-center gap-4">
                            <a href="/shop" className="premium-button">Continue shopping</a>
                            <button className="premium-button-secondary" onClick={() => setStep(1)}>Start again</button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default TradeIn;
