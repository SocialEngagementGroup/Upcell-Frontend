import React, { useMemo, useState } from 'react';
import ScrollToTop from '../../utilities/ScrollToTop';
import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import BoltIcon from '@mui/icons-material/Bolt';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import TabletMacIcon from '@mui/icons-material/TabletMac';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import axiosInstance from '../../utilities/axiosInstance';

/* ───────────── STATIC DATA ───────────── */

const deviceOptions = [
    { id: 'iPhone', title: 'iPhone', desc: 'Trade in any iPhone 11 through iPhone 16 Pro Max — unlocked or carrier models accepted.', icon: PhoneIphoneIcon },
    { id: 'iPad', title: 'iPad', desc: 'iPad Air, iPad mini, and iPad Pro accepted — Wi-Fi and cellular models welcome.', icon: TabletMacIcon },
    { id: 'MacBook', title: 'MacBook', desc: 'MacBook Air and MacBook Pro — M1, M2, and M3 chips all eligible for trade-in.', icon: LaptopMacIcon },
];

const modelOptions = {
    'iPhone': [
        { id: 'iphone16promax', title: 'iPhone 16 Pro Max' },
        { id: 'iphone16pro', title: 'iPhone 16 Pro' },
        { id: 'iphone16plus', title: 'iPhone 16 Plus' },
        { id: 'iphone16', title: 'iPhone 16' },
        { id: 'iphone15promax', title: 'iPhone 15 Pro Max' },
        { id: 'iphone15pro', title: 'iPhone 15 Pro' },
        { id: 'iphone15plus', title: 'iPhone 15 Plus' },
        { id: 'iphone15', title: 'iPhone 15' },
        { id: 'iphone14promax', title: 'iPhone 14 Pro Max' },
        { id: 'iphone14pro', title: 'iPhone 14 Pro' },
        { id: 'iphone14', title: 'iPhone 14' },
        { id: 'iphone13pro', title: 'iPhone 13 Pro' },
        { id: 'iphone13', title: 'iPhone 13' },
        { id: 'iphone12pro', title: 'iPhone 12 Pro' },
        { id: 'iphone12', title: 'iPhone 12' },
        { id: 'iphone11', title: 'iPhone 11' },
    ],
    'iPad': [
        { id: 'ipadprom4', title: 'iPad Pro M4' },
        { id: 'ipadpro12', title: 'iPad Pro 12.9-inch' },
        { id: 'ipadpro11', title: 'iPad Pro 11-inch' },
        { id: 'ipadairm2', title: 'iPad Air M2' },
        { id: 'ipadair5', title: 'iPad Air (5th Gen)' },
        { id: 'ipadmini6', title: 'iPad mini (6th Gen)' },
        { id: 'ipad10', title: 'iPad (10th Gen)' },
        { id: 'ipad9', title: 'iPad (9th Gen)' },
    ],
    'MacBook': [
        { id: 'mbp16m3', title: 'MacBook Pro 16" M3' },
        { id: 'mbp14m3', title: 'MacBook Pro 14" M3' },
        { id: 'mbp16m2', title: 'MacBook Pro 16" M2' },
        { id: 'mbp14m2', title: 'MacBook Pro 14" M2' },
        { id: 'mba15m3', title: 'MacBook Air 15" M3' },
        { id: 'mba13m3', title: 'MacBook Air 13" M3' },
        { id: 'mba15m2', title: 'MacBook Air 15" M2' },
        { id: 'mba13m2', title: 'MacBook Air 13" M2' },
    ],
};

const carrierOptions = {
    'iPhone': [
        { id: 'unlocked', title: 'Unlocked' },
        { id: 'att', title: 'AT&T' },
        { id: 'tmobile', title: 'T-Mobile' },
        { id: 'verizon', title: 'Verizon' },
    ],
    'iPad': [
        { id: 'wifi', title: 'Wi-Fi Only' },
        { id: 'wifi_cellular', title: 'Wi-Fi + Cellular' },
    ],
    'MacBook': null, // MacBooks skip this step
};

const storageOptions = {
    'iPhone': ['64GB', '128GB', '256GB', '512GB', '1TB'],
    'iPad': ['64GB', '128GB', '256GB', '512GB', '1TB'],
    'MacBook': ['256GB', '512GB', '1TB', '2TB'],
};

const conditionQuestions = {
    'iPhone': [
        { id: 'powersOn', question: 'Does the device power on and hold a charge?', yes: 'Yes, it powers on normally', no: 'No, it won\'t turn on' },
        { id: 'functional', question: 'Is the device fully functional?', subtitle: 'All buttons, touch, Face ID, cameras, and speakers work normally.', yes: 'Yes, everything works', no: 'No, something is broken' },
        { id: 'cracked', question: 'Are the front and back glass free of cracks?', yes: 'Yes, no cracks', no: 'No, there are cracks' },
        { id: 'screenCondition', question: 'What best describes the screen condition?', options: [
            { id: 'flawless', title: 'Flawless', desc: 'No visible scratches or marks on the display.' },
            { id: 'good', title: 'Good', desc: 'Minor scratches only visible when screen is off.' },
            { id: 'fair', title: 'Fair', desc: 'Noticeable scratches visible during regular use.' },
        ]},
        { id: 'bodyCondition', question: 'What best describes the body condition?', options: [
            { id: 'flawless', title: 'Like New', desc: 'No visible wear on the frame or back glass.' },
            { id: 'good', title: 'Good', desc: 'Minor cosmetic marks that don\'t affect function.' },
            { id: 'fair', title: 'Fair', desc: 'Noticeable dents, scratches, or marks on the body.' },
        ]},
    ],
    'iPad': [
        { id: 'powersOn', question: 'Does the device power on and hold a charge?', yes: 'Yes, it powers on normally', no: 'No, it won\'t turn on' },
        { id: 'functional', question: 'Is the device fully functional?', subtitle: 'Touch, cameras, buttons, and speakers all work properly.', yes: 'Yes, everything works', no: 'No, something is broken' },
        { id: 'cracked', question: 'Is the screen free of cracks?', yes: 'Yes, no cracks', no: 'No, there are cracks' },
        { id: 'screenCondition', question: 'What best describes the screen condition?', options: [
            { id: 'flawless', title: 'Flawless', desc: 'No visible scratches.' },
            { id: 'good', title: 'Good', desc: 'Minor scratches only visible when screen is off.' },
            { id: 'fair', title: 'Fair', desc: 'Noticeable scratches visible during use.' },
        ]},
    ],
    'MacBook': [
        { id: 'powersOn', question: 'Does the MacBook power on and hold a charge?', yes: 'Yes, it powers on normally', no: 'No, it won\'t turn on' },
        { id: 'functional', question: 'Is the MacBook fully functional?', subtitle: 'Keyboard, trackpad, display, ports, and speakers all work properly.', yes: 'Yes, everything works', no: 'No, something is broken' },
        { id: 'screenCondition', question: 'What best describes the overall condition?', options: [
            { id: 'flawless', title: 'Like New', desc: 'No visible scratches, dents, or marks.' },
            { id: 'good', title: 'Good', desc: 'Minor cosmetic wear that doesn\'t affect use.' },
            { id: 'fair', title: 'Fair', desc: 'Visible wear, small dents, or noticeable scratches.' },
        ]},
    ],
};

/* ───────────── PRICING LOGIC ───────────── */

const basePrices = {
    'iphone16promax': 820, 'iphone16pro': 720, 'iphone16plus': 580, 'iphone16': 510,
    'iphone15promax': 680, 'iphone15pro': 590, 'iphone15plus': 470, 'iphone15': 400,
    'iphone14promax': 520, 'iphone14pro': 440, 'iphone14': 310,
    'iphone13pro': 360, 'iphone13': 250, 'iphone12pro': 270, 'iphone12': 190, 'iphone11': 120,
    'ipadprom4': 680, 'ipadpro12': 520, 'ipadpro11': 430, 'ipadairm2': 400,
    'ipadair5': 320, 'ipadmini6': 260, 'ipad10': 210, 'ipad9': 140,
    'mbp16m3': 1250, 'mbp14m3': 1050, 'mbp16m2': 980, 'mbp14m2': 820,
    'mba15m3': 780, 'mba13m3': 650, 'mba15m2': 620, 'mba13m2': 520,
};

const storageMultiplier = { '64GB': 0.85, '128GB': 1.0, '256GB': 1.12, '512GB': 1.25, '1TB': 1.45, '2TB': 1.65 };

function calculateEstimate(selection) {
    const base = basePrices[selection.model] || 0;
    if (!base) return null;

    let price = base;

    // Storage multiplier
    if (selection.storage) {
        price *= (storageMultiplier[selection.storage] || 1.0);
    }

    // Condition deductions
    const answers = selection.answers || {};

    if (answers.powersOn === false) return Math.round(price * 0.15); // broken = very low
    if (answers.functional === false) price *= 0.55;
    if (answers.cracked === false) price *= 0.50;

    // Screen condition
    if (answers.screenCondition === 'good') price *= 0.90;
    if (answers.screenCondition === 'fair') price *= 0.75;

    // Body condition
    if (answers.bodyCondition === 'good') price *= 0.92;
    if (answers.bodyCondition === 'fair') price *= 0.80;

    return Math.round(price);
}

/* ───────────── STEP LABELS ───────────── */

function getStepLabels(device) {
    const hasCarrier = carrierOptions[device] !== null;
    const baseSteps = hasCarrier 
        ? ['Device', 'Model', 'Carrier', 'Storage', 'Condition', 'Your details']
        : ['Device', 'Model', 'Storage', 'Condition', 'Your details'];
    return [...baseSteps, 'Confirmation'];
}

function getTotalSteps(device) {
    return getStepLabels(device).length;
}

/* ───────────── COMPONENT ───────────── */

const TradeIn = () => {
    const [step, setStep] = useState(1);
    const [selection, setSelection] = useState({
        device: '',
        model: '',
        carrier: '',
        storage: '',
        answers: {},
        name: '',
        email: '',
        phone: '',
    });
    const [conditionStep, setConditionStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [savedRequest, setSavedRequest] = useState(null);

    const hasCarrier = carrierOptions[selection.device] !== null;

    // Map logical step names to step numbers dynamically
    const stepMap = useMemo(() => {
        const labels = getStepLabels(selection.device || 'iPhone');
        const map = {};
        labels.forEach((label, i) => { map[label] = i + 1; });
        return map;
    }, [selection.device]);

    const totalSteps = getTotalSteps(selection.device || 'iPhone');

    const estimate = useMemo(() => calculateEstimate(selection), [selection]);

    const currentQuestions = conditionQuestions[selection.device] || [];
    const currentQuestion = currentQuestions[conditionStep];
    const allConditionAnswered = conditionStep >= currentQuestions.length;

    const next = () => setStep((prev) => Math.min(prev + 1, totalSteps));
    const back = () => {
        if (step === stepMap['Condition'] && conditionStep > 0) {
            setConditionStep((prev) => prev - 1);
        } else {
            setStep((prev) => Math.max(1, prev - 1));
        }
    };

    const handleConditionAnswer = (questionId, value) => {
        setSelection((prev) => ({
            ...prev,
            answers: { ...prev.answers, [questionId]: value },
        }));
        if (conditionStep < currentQuestions.length - 1) {
            setConditionStep((prev) => prev + 1);
        } else {
            setConditionStep(currentQuestions.length); // mark all answered
            setStep(stepMap['Your details']);
        }
    };

    const resetFlow = () => {
        setStep(1);
        setConditionStep(0);
        setSelection({ device: '', model: '', carrier: '', storage: '', answers: {}, name: '', email: '', phone: '' });
        setIsSubmitting(false);
        setSubmitError('');
        setSavedRequest(null);
    };

    const stepLabels = getStepLabels(selection.device || 'iPhone');
    const selectedModelTitle = (modelOptions[selection.device] || []).find((model) => model.id === selection.model)?.title || '';
    const selectedCarrierTitle = (carrierOptions[selection.device] || []).find((carrier) => carrier.id === selection.carrier)?.title || '';

    const handleSubmitTradeInRequest = async () => {
        if (!selection.name.trim() || !selection.email.trim() || !selection.phone.trim()) {
            setSubmitError('Please fill in your name, email, and phone number before submitting.');
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        try {
            const response = await axiosInstance.post('trade-in-requests', {
                device: selection.device,
                model: selection.model,
                modelTitle: selectedModelTitle,
                carrier: selection.carrier || undefined,
                carrierTitle: selectedCarrierTitle || undefined,
                storage: selection.storage,
                estimate: estimate || 0,
                answers: selection.answers,
                name: selection.name.trim(),
                email: selection.email.trim(),
                phone: selection.phone.trim(),
            });

            setSavedRequest(response.data);
            setStep(stepMap['Confirmation']);
        } catch (error) {
            setSubmitError(error?.response?.data?.error || 'Something went wrong while submitting your request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-shell">
            <ScrollToTop />

            {/* ─── Hero ─── */}
            <section className="page-container pb-10 pt-6">
                <div className="rounded-[40px] bg-[linear-gradient(135deg,#0f1012_0%,#1b1e24_55%,#2b3138_100%)] px-8 py-10 text-white shadow-medium md:px-12 md:py-14">
                    <nav className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <KeyboardArrowRightIcon className="!text-sm" />
                        <span className="text-white">Trade In</span>
                    </nav>
                    <h1 className="mt-6 text-[clamp(2.8rem,5vw,5rem)] leading-[0.92] text-white">Trade In Your iPhone, iPad or MacBook — Get Paid Fast</h1>
                    <p className="mt-5 max-w-[680px] text-lg leading-8 text-white/72">
                        Get an instant trade-in estimate for your used Apple device. Free insured shipping, 24-hour payout after inspection, and a transparent process from start to finish.
                    </p>
                </div>
            </section>

            {/* ─── Progress Bar ─── */}
            <section className="page-container pb-16">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex flex-wrap gap-3">
                        {stepLabels.filter(l => l !== 'Confirmation').map((label, index) => (
                            <div
                                key={label}
                                className={`rounded-full px-5 py-3 text-sm font-bold transition-all duration-300 ${
                                    step === index + 1
                                        ? 'bg-apple-text text-white'
                                        : step > index + 1
                                            ? 'border border-apple-text/20 bg-apple-text/5 text-apple-text'
                                            : 'border border-black/[0.08] bg-white text-apple-gray'
                                }`}
                            >
                                {step > index + 1 ? '✓' : index + 1}. {label}
                            </div>
                        ))}
                    </div>
                    {step > 1 && (
                        <button
                            className="flex h-[56px] items-center gap-2 rounded-full border border-black/[0.08] bg-white px-6 text-[15px] font-bold text-apple-text transition-all duration-300 hover:bg-surface-alt active:scale-[0.98]"
                            onClick={back}
                        >
                            <KeyboardArrowLeftIcon className="!text-[20px]" /> Back
                        </button>
                    )}
                </div>

                {/* ─── Step 1: Choose Device ─── */}
                {step === 1 && (
                    <div className="grid gap-6 lg:grid-cols-3">
                        {deviceOptions.map((device) => {
                            const Icon = device.icon;
                            return (
                                <button
                                    key={device.id}
                                    className="premium-card rounded-[32px] p-8 text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-medium"
                                    onClick={() => {
                                        setSelection((prev) => ({ ...prev, device: device.id, model: '', carrier: '', storage: '', answers: {} }));
                                        setConditionStep(0);
                                        setStep(2);
                                    }}
                                >
                                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-alt">
                                        <Icon className="!text-[24px] text-apple-text" />
                                    </div>
                                    <h2 className="text-[34px]">{device.title}</h2>
                                    <p className="mt-3 text-base leading-8 text-ink-soft">{device.desc}</p>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* ─── Step 2: Choose Model ─── */}
                {step === stepMap['Model'] && (
                    <div>
                        <h2 className="mb-6 text-[32px]">Select your {selection.device} model</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {(modelOptions[selection.device] || []).map((model) => (
                                <button
                                    key={model.id}
                                    className="premium-card rounded-[28px] p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-medium"
                                    onClick={() => {
                                        setSelection((prev) => ({ ...prev, model: model.id }));
                                        next();
                                    }}
                                >
                                    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray">{selection.device}</div>
                                    <h3 className="mt-3 text-[22px] font-bold">{model.title}</h3>
                                    {basePrices[model.id] && (
                                        <p className="mt-2 text-sm text-ink-soft">Up to <span className="font-bold text-apple-text">${Math.round(basePrices[model.id] * 1.45)}</span></p>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ─── Step: Choose Carrier (only for iPhone / iPad) ─── */}
                {hasCarrier && step === stepMap['Carrier'] && (
                    <div>
                        <h2 className="mb-2 text-[32px]">Select your carrier</h2>
                        <p className="mb-6 text-base text-ink-soft">Choose the carrier your device is currently on or if it's unlocked.</p>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {carrierOptions[selection.device].map((carrier) => (
                                <button
                                    key={carrier.id}
                                    className="premium-card rounded-[28px] p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-medium"
                                    onClick={() => {
                                        setSelection((prev) => ({ ...prev, carrier: carrier.id }));
                                        next();
                                    }}
                                >
                                    <h3 className="text-[24px] font-bold">{carrier.title}</h3>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ─── Step: Choose Storage ─── */}
                {step === stepMap['Storage'] && (
                    <div>
                        <h2 className="mb-2 text-[32px]">Select your storage capacity</h2>
                        <p className="mb-6 text-base text-ink-soft">Choose the storage size of your device.</p>
                        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                            {(storageOptions[selection.device] || []).map((storage) => (
                                <button
                                    key={storage}
                                    className="premium-card rounded-[28px] p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-medium"
                                    onClick={() => {
                                        setSelection((prev) => ({ ...prev, storage }));
                                        next();
                                    }}
                                >
                                    <h3 className="text-[28px] font-extrabold">{storage}</h3>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ─── Step: Condition Questions ─── */}
                {step === stepMap['Condition'] && !allConditionAnswered && currentQuestion && (
                    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
                        <div>
                            <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray">
                                Question {conditionStep + 1} of {currentQuestions.length}
                            </div>
                            <h2 className="mb-2 text-[32px]">{currentQuestion.question}</h2>
                            {currentQuestion.subtitle && (
                                <p className="mb-6 text-base text-ink-soft">{currentQuestion.subtitle}</p>
                            )}

                            {/* Yes/No Questions */}
                            {currentQuestion.yes && currentQuestion.no && (
                                <div className="mt-6 grid gap-4 md:grid-cols-2">
                                    <button
                                        className="premium-card rounded-[28px] p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-medium hover:border-green-500/20"
                                        onClick={() => handleConditionAnswer(currentQuestion.id, true)}
                                    >
                                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
                                            <CheckCircleIcon className="!text-[20px]" />
                                        </div>
                                        <h3 className="text-[20px] font-bold">{currentQuestion.yes}</h3>
                                    </button>
                                    <button
                                        className="premium-card rounded-[28px] p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-medium hover:border-red-500/20"
                                        onClick={() => handleConditionAnswer(currentQuestion.id, false)}
                                    >
                                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500">
                                            ✕
                                        </div>
                                        <h3 className="text-[20px] font-bold">{currentQuestion.no}</h3>
                                    </button>
                                </div>
                            )}

                            {/* Multiple Choice Questions (Screen/Body condition) */}
                            {currentQuestion.options && (
                                <div className="mt-6 grid gap-4">
                                    {currentQuestion.options.map((option) => (
                                        <button
                                            key={option.id}
                                            className="premium-card rounded-[28px] p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-medium"
                                            onClick={() => handleConditionAnswer(currentQuestion.id, option.id)}
                                        >
                                            <h3 className="text-[22px] font-bold">{option.title}</h3>
                                            <p className="mt-2 text-sm leading-7 text-ink-soft">{option.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Live Estimate Sidebar */}
                        <aside className="premium-card h-fit rounded-[32px] p-6 lg:sticky lg:top-28">
                            <h3 className="text-[24px]">Your selection</h3>
                            <div className="mt-5 space-y-3 text-sm">
                                {selection.device && (
                                    <div className="flex justify-between"><span className="text-ink-soft">Device</span><span className="font-bold text-apple-text">{selection.device}</span></div>
                                )}
                                {selection.model && (
                                    <div className="flex justify-between"><span className="text-ink-soft">Model</span><span className="font-bold text-apple-text">{(modelOptions[selection.device] || []).find(m => m.id === selection.model)?.title}</span></div>
                                )}
                                {selection.carrier && (
                                    <div className="flex justify-between"><span className="text-ink-soft">Carrier</span><span className="font-bold text-apple-text">{(carrierOptions[selection.device] || []).find(c => c.id === selection.carrier)?.title}</span></div>
                                )}
                                {selection.storage && (
                                    <div className="flex justify-between"><span className="text-ink-soft">Storage</span><span className="font-bold text-apple-text">{selection.storage}</span></div>
                                )}
                            </div>
                            <div className="mt-6 border-t border-black/[0.06] pt-6">
                                <div className="text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Estimated value</div>
                                <div className="mt-2 text-4xl font-extrabold text-apple-text">
                                    {estimate ? `$${estimate}` : '—'}
                                </div>
                                <p className="mt-2 text-xs leading-5 text-ink-soft">Final value confirmed after inspection.</p>
                            </div>
                        </aside>
                    </div>
                )}



                {/* ─── Step: Your Details (Form + Valuation) ─── */}
                {step === stepMap['Your details'] && (
                    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                        <div className="space-y-8">
                            {/* Valuation Summary Card */}
                            <div className="premium-card rounded-[36px] p-8 md:p-10 border border-apple-text/10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                                        <CheckCircleIcon className="!text-[24px] text-green-600" />
                                    </div>
                                    <h2 className="text-[32px] font-bold">Your evaluation is ready</h2>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-6xl font-extrabold text-apple-text">${estimate || 0}</span>
                                    <span className="text-ink-soft text-lg font-medium">Estimated Payout</span>
                                </div>
                                <p className="mt-6 text-base leading-8 text-ink-soft max-w-[540px]">
                                    Lock in this offer by providing your details below. We'll send a prepaid shipping kit to your address right away.
                                </p>
                                
                                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    <div className="rounded-2xl bg-surface-alt p-4">
                                        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-apple-gray">Device</div>
                                        <div className="mt-1 font-bold truncate">{selection.device}</div>
                                    </div>
                                    <div className="rounded-2xl bg-surface-alt p-4">
                                        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-apple-gray">Model</div>
                                        <div className="mt-1 font-bold truncate">{(modelOptions[selection.device] || []).find(m => m.id === selection.model)?.title}</div>
                                    </div>
                                    <div className="rounded-2xl bg-surface-alt p-4">
                                        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-apple-gray">Storage</div>
                                        <div className="mt-1 font-bold truncate">{selection.storage}</div>
                                    </div>
                                    <div className="rounded-2xl bg-surface-alt p-4">
                                        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-apple-gray">Carrier</div>
                                        <div className="mt-1 font-bold truncate">{selection.carrier ? (carrierOptions[selection.device] || []).find(c => c.id === selection.carrier)?.title : 'N/A'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form Card */}
                            <div className="premium-card rounded-[36px] p-8 md:p-10">
                                <h3 className="text-[28px] mb-6">Finalize your details</h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <input className="premium-input w-full" placeholder="Full name" value={selection.name} onChange={(e) => setSelection((prev) => ({ ...prev, name: e.target.value }))} />
                                    </div>
                                    <input className="premium-input" type="email" placeholder="Email address" value={selection.email} onChange={(e) => setSelection((prev) => ({ ...prev, email: e.target.value }))} />
                                    <input className="premium-input" type="tel" placeholder="Phone number" value={selection.phone} onChange={(e) => setSelection((prev) => ({ ...prev, phone: e.target.value }))} />
                                </div>
                                {submitError && (
                                    <div className="mt-5 rounded-[20px] border border-red-500/15 bg-red-50 px-4 py-3 text-sm text-red-600">
                                        {submitError}
                                    </div>
                                )}
                                <button
                                    className="premium-button mt-8 w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-70"
                                    onClick={handleSubmitTradeInRequest}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Trade-In Request'}
                                </button>
                            </div>
                        </div>

                        <aside className="space-y-6">
                            <div className="premium-card rounded-[32px] p-6 lg:sticky lg:top-28">
                                <h3 className="text-[22px] mb-6">Included benefits</h3>
                                <div className="space-y-5">
                                    <div className="flex gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-apple-text/5 text-apple-text">
                                            <LocalShippingOutlinedIcon className="!text-[20px]" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-apple-text">Free Shipping</div>
                                            <p className="mt-1 text-sm leading-6 text-ink-soft">Prepaid kit delivered to your door.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-apple-text/5 text-apple-text">
                                            <SecurityIcon className="!text-[20px]" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-apple-text">Insured Transit</div>
                                            <p className="mt-1 text-sm leading-6 text-ink-soft">Your device is fully protected during delivery.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-apple-text/5 text-apple-text">
                                            <BoltIcon className="!text-[20px]" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-apple-text">Fast Payout</div>
                                            <p className="mt-1 text-sm leading-6 text-ink-soft">Paid out within 24 hours of inspection.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                )}

                {/* ─── Step: Confirmation ─── */}
                {step === stepMap['Confirmation'] && (
                    <div className="premium-card rounded-[36px] px-8 py-16 text-center">
                        <CheckCircleIcon className="!text-[72px] text-apple-text" />
                        <h2 className="mt-6 text-[42px]">Trade-in request received.</h2>
                        <p className="mx-auto mt-4 max-w-[560px] text-lg leading-8 text-ink-soft">
                            We'll email your prepaid shipping label, inspection guidance, and next steps within 1 business day. Payout is issued within 24 hours of device inspection.
                        </p>
                        <div className="mx-auto mt-6 max-w-[400px] rounded-[24px] border border-black/[0.06] bg-surface-alt/50 p-5">
                            <div className="text-sm text-ink-soft">Estimated payout</div>
                            <div className="mt-1 text-3xl font-extrabold text-apple-text">${estimate || 0}</div>
                        </div>
                        {savedRequest?._id && (
                            <div className="mx-auto mt-4 max-w-[400px] rounded-[24px] border border-black/[0.06] bg-white p-5 text-left">
                                <div className="text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Request ID</div>
                                <div className="mt-2 break-all text-sm font-bold text-apple-text">{savedRequest._id}</div>
                                <div className="mt-3 text-xs text-ink-soft">Status: {savedRequest.status}</div>
                            </div>
                        )}
                        <div className="mt-10 flex justify-center gap-4">
                            <Link to="/shop" className="premium-button min-w-[200px]">Continue shopping</Link>
                            <button className="premium-button-secondary min-w-[200px]" onClick={resetFlow}>Start again</button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default TradeIn;
