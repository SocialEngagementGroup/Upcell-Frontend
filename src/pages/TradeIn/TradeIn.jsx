import React, { useMemo, useState } from 'react';
import Seo from '../../components/Seo/Seo';
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
import AndroidIcon from '@mui/icons-material/Android';
import axiosInstance from '../../utilities/axiosInstance';
import { extractApiError, validateEmailAddress, validatePhoneNumber, validateRequiredText } from '../../utilities/formValidation';
import useFormAnalytics from '../../utilities/useFormAnalytics';

/* ───────────── STATIC DATA ───────────── */

const deviceOptions = [
    { id: 'iPhone', title: 'iPhone', desc: 'Trade in any iPhone from the iPhone 11 to the iPhone 16 Pro Max. We accept unlocked and carrier models.', icon: PhoneIphoneIcon },
    { id: 'iPad', title: 'iPad', desc: 'We accept iPad Air, iPad mini, and iPad Pro. Both Wi-Fi and cellular models are welcome.', icon: TabletMacIcon },
    { id: 'MacBook', title: 'MacBook', desc: 'Trade in MacBook Air and MacBook Pro models. M1, M2, and M3 chips are all eligible.', icon: LaptopMacIcon },
    { id: 'Android', title: 'Android', desc: 'Trade in your Samsung Galaxy S, Google Pixel, or other Android device.', icon: AndroidIcon },
];

const androidBrandOptions = [
    { id: 'Samsung', title: 'Samsung Galaxy', desc: 'Galaxy S series accepted, including the S22 Ultra and newer flagships.', icon: AndroidIcon },
    { id: 'Google', title: 'Google Pixel', desc: 'Pixel 8 and newer Pixel devices accepted.', icon: AndroidIcon },
    { id: 'AndroidOther', title: 'Other Brand', desc: "Different brand or model? Tell us about it and our team will reach out with an offer.", icon: AndroidIcon },
];

// The models come from GET /trade-in-catalog. This was a fourth table in the
// page's bundle, and the one that had to be edited every time UpCell started
// or stopped quoting for a device — a deploy to add a phone.
//
// carrierOptions and storageOptions below stay: they are what the *form*
// offers, and the catalogue reports what each model is priced for, which is
// not the same list. A model with no 1TB price should still show 1TB as a
// choice; it is quoted at the base price, not hidden.


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
    'Samsung': [
        { id: 'unlocked', title: 'Unlocked' },
        { id: 'att', title: 'AT&T' },
        { id: 'tmobile', title: 'T-Mobile' },
        { id: 'verizon', title: 'Verizon' },
    ],
    'Google': [
        { id: 'unlocked', title: 'Unlocked' },
        { id: 'att', title: 'AT&T' },
        { id: 'tmobile', title: 'T-Mobile' },
        { id: 'verizon', title: 'Verizon' },
    ],
};

const storageOptions = {
    'iPhone': ['64GB', '128GB', '256GB', '512GB', '1TB'],
    'iPad': ['64GB', '128GB', '256GB', '512GB', '1TB'],
    'MacBook': ['256GB', '512GB', '1TB', '2TB'],
    'Samsung': ['128GB', '256GB', '512GB', '1TB'],
    'Google': ['128GB', '256GB', '512GB', '1TB'],
};

// The condition questions come from GET /trade-in-catalog, with the price
// each answer carries left behind on the server. The page needs to know what
// to ask; it does not need to know that a cracked screen costs half.


/* ───────────── PRICING ─────────────

    There is none here any more.

    basePrices, storageMultiplier and calculateEstimate used to live at this
    spot: 49 prices, a multiplier table and the deduction chain, shipped to
    every visitor and run in their browser. The number they produced was
    posted with the request and stored as the offer, so editing it before
    sending changed what UpCell was asked to pay.

    The server prices it now, and this page asks. See queries/tradeIn.js.
                                                                          */

/* ───────────── STEP LABELS ───────────── */

function getStepLabels(device) {
    if (device === 'AndroidOther') {
        return ['Device', 'Your details', 'Confirmation'];
    }
    const hasCarrier = carrierOptions[device] !== null && carrierOptions[device] !== undefined;
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
        customBrand: '',
        customModel: '',
    });
    const [showAndroidBrands, setShowAndroidBrands] = useState(false);
    const [conditionStep, setConditionStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [savedRequest, setSavedRequest] = useState(null);
    const { markInteraction, trackSuccess, trackFailure } = useFormAnalytics('trade_in');

    const hasCarrier = carrierOptions[selection.device] !== null;

    // Map logical step names to step numbers dynamically
    const stepMap = useMemo(() => {
        const labels = getStepLabels(selection.device || 'iPhone');
        const map = {};
        labels.forEach((label, i) => { map[label] = i + 1; });
        return map;
    }, [selection.device]);

    const totalSteps = getTotalSteps(selection.device || 'iPhone');

    const { data: catalog } = useTradeInCatalogQuery();

    // "Up to $X" per model, from the catalogue. A Map so the model grid is a
    // lookup rather than a scan of 49 rows per card.
    const teasers = useMemo(
        () => new Map((catalog?.models || []).map((model) => [model.modelKey, model.teaserDollars])),
        [catalog]
    );
    const teaserFor = (modelKey) => teasers.get(modelKey);

    // Grouped once rather than filtered per render. The catalogue is one flat
    // list; the page shows one device type at a time.
    const modelsByDevice = useMemo(() => {
        const grouped = {};
        for (const model of catalog?.models || []) {
            (grouped[model.deviceType] ||= []).push({ id: model.modelKey, title: model.displayName });
        }
        return grouped;
    }, [catalog]);

    // The server's number, asked for as the customer answers. Nothing on this
    // page computes a price any more.
    const { quote, pending: quotePending, failed: quoteFailed } = useTradeInQuote({
        modelKey: selection.model,
        storage: selection.storage,
        carrier: selection.carrier,
        answers: selection.answers,
    });
    const estimate = quote?.estimate ?? null;

    const currentQuestions = useMemo(() => {
        const set = (catalog?.questions || []).find((entry) => entry.deviceType === selection.device);
        return set?.questions || [];
    }, [catalog, selection.device]);
    const currentQuestion = currentQuestions[conditionStep];
    const allConditionAnswered = conditionStep >= currentQuestions.length;

    const next = () => setStep((prev) => Math.min(prev + 1, totalSteps));
    const back = () => {
        if (step === stepMap['Condition'] && conditionStep > 0) {
            setConditionStep((prev) => prev - 1);
            return;
        }
        if (step === 2 && (selection.device === 'Samsung' || selection.device === 'Google' || selection.device === 'AndroidOther')) {
            // Going back from inside an Android sub-flow returns to the brand picker
            setSelection((prev) => ({ ...prev, device: '', model: '', carrier: '', storage: '', answers: {}, customBrand: '', customModel: '' }));
            setShowAndroidBrands(true);
            setStep(1);
            return;
        }
        setStep((prev) => Math.max(1, prev - 1));
    };

    const handleConditionAnswer = (questionId, value) => {
        markInteraction();
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
        setShowAndroidBrands(false);
        setSelection({ device: '', model: '', carrier: '', storage: '', answers: {}, name: '', email: '', phone: '', customBrand: '', customModel: '' });
        setIsSubmitting(false);
        setSubmitError('');
        setSavedRequest(null);
    };

    const stepLabels = getStepLabels(selection.device || 'iPhone');
    const selectedModelTitle = (modelsByDevice[selection.device] || []).find((model) => model.id === selection.model)?.title || '';
    const selectedCarrierTitle = (carrierOptions[selection.device] || []).find((carrier) => carrier.id === selection.carrier)?.title || '';

    const handleSubmitTradeInRequest = async () => {
        if (isSubmitting) return;

        const isAndroidOther = selection.device === 'AndroidOther';

        const nameError = validateRequiredText('Name', selection.name, { min: 2, max: 120 });
        const emailError = validateEmailAddress(selection.email);
        const phoneError = validatePhoneNumber(selection.phone);

        let selectionError = '';
        let estimateError = '';
        if (isAndroidOther) {
            const brandError = validateRequiredText('Phone brand', selection.customBrand, { min: 2, max: 60 });
            const modelError = validateRequiredText('Phone model', selection.customModel, { min: 1, max: 80 });
            selectionError = brandError || modelError;
        } else {
            selectionError = !selection.device || !selection.model || !selection.storage
                ? 'Please complete your device, model, and storage selections before submitting.'
                : '';
            estimateError = typeof estimate !== 'number' ? 'We could not calculate your trade-in estimate. Please review your answers.' : '';
        }

        const validationMessage = nameError || emailError || phoneError || selectionError || estimateError;

        if (validationMessage) {
            setSubmitError(validationMessage);
            trackFailure(validationMessage, { phase: 'validation', device: selection.device });
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');
        markInteraction();

        try {
            const payload = isAndroidOther
                ? {
                    device: 'Android',
                    model: 'other',
                    modelTitle: `${selection.customBrand.trim()} ${selection.customModel.trim()}`.trim(),
                    storage: 'N/A',
                    estimate: 0,
                    answers: {
                        type: 'android_other',
                        brand: selection.customBrand.trim(),
                        model: selection.customModel.trim(),
                    },
                    name: selection.name.trim(),
                    email: selection.email.trim(),
                    phone: selection.phone.trim(),
                }
                : {
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
                };

            const response = await axiosInstance.post('trade-in-requests', payload);

            setSavedRequest(response.data);

            // The server's figure, not the one on screen. They are the same
            // number now, but reporting on what was actually stored is the
            // habit worth having.
            trackTradeInLead({
                modelTitle: selectedModelTitle,
                estimate: response.data?.estimate,
            });

            trackSuccess({
                phase: 'request',
                device: selection.device,
                model: selection.model,
                storage: selection.storage,
                estimate,
            });
            setStep(stepMap['Confirmation']);
        } catch (error) {
            const failureMessage = extractApiError(error, 'Something went wrong while submitting your request. Please try again.');
            setSubmitError(failureMessage);
            trackFailure(failureMessage, { phase: 'request', device: selection.device, model: selection.model });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-shell">
            <Seo
                title="Trade in your phone, tablet or laptop"
                description="Get an instant quote for your used Apple or Android device. Free insured shipping and payment within a day of inspection."
                path="/trade-in"
            />
            <ScrollToTop />

            {/* ─── Hero ─── */}
            <section className="page-container pb-10 pt-6">
                <div className="rounded-[28px] bg-[linear-gradient(135deg,#0f1012_0%,#1b1e24_55%,#2b3138_100%)] px-6 py-8 text-white shadow-medium sm:rounded-[40px] sm:px-8 sm:py-10 md:px-12 md:py-14">
                    <nav className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60 sm:mb-8">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <KeyboardArrowRightIcon className="!text-sm" />
                        <span className="text-white">Trade In</span>
                    </nav>
                    <h1 className="mt-4 text-[clamp(2.1rem,5vw,5rem)] leading-[0.96] text-white sm:mt-6 sm:leading-[0.92]">Trade In Your iPhone, iPad, MacBook or Android and Get Paid Fast</h1>
                    <p className="mt-4 max-w-[680px] text-base leading-7 text-white/72 sm:mt-5 sm:text-lg sm:leading-8">
                        Get an instant trade-in estimate for your used Apple or Android device. Free insured shipping, 24-hour payout after inspection, and a transparent process from start to finish.
                    </p>
                </div>
            </section>

            {/* ─── Progress Bar ─── */}
            <section className="page-container pb-16">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        {stepLabels.filter(l => l !== 'Confirmation').map((label, index) => (
                            <div
                                key={label}
                                className={`rounded-full px-3 py-2 text-xs font-bold transition-all duration-300 sm:px-5 sm:py-3 sm:text-sm ${
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
                    {(step > 1 || showAndroidBrands) && (
                        <button
                            className="flex h-12 shrink-0 items-center gap-2 self-start rounded-full border border-black/[0.08] bg-white px-6 text-[15px] font-bold text-apple-text transition-all duration-300 hover:bg-surface-alt active:scale-[0.98] sm:h-[56px] sm:self-auto"
                            onClick={() => {
                                if (showAndroidBrands && step === 1) {
                                    setShowAndroidBrands(false);
                                    return;
                                }
                                back();
                            }}
                        >
                            <KeyboardArrowLeftIcon className="!text-[20px]" /> Back
                        </button>
                    )}
                </div>

                {/* ─── Step 1: Choose Device ─── */}
                {step === 1 && !showAndroidBrands && (
                    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
                        {deviceOptions.map((device) => {
                            const Icon = device.icon;
                            return (
                                <button
                                    key={device.id}
                                    className="premium-card rounded-[28px] p-6 text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-medium sm:rounded-[32px] sm:p-8"
                                    onClick={() => {
                                        markInteraction();
                                        if (device.id === 'Android') {
                                            setShowAndroidBrands(true);
                                            return;
                                        }
                                        setSelection((prev) => ({ ...prev, device: device.id, model: '', carrier: '', storage: '', answers: {}, customBrand: '', customModel: '' }));
                                        setConditionStep(0);
                                        setStep(2);
                                    }}
                                >
                                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-alt">
                                        <Icon className="!text-[24px] text-apple-text" />
                                    </div>
                                    <h2 className="text-[28px] sm:text-[34px]">{device.title}</h2>
                                    <p className="mt-3 text-base leading-8 text-ink-soft">{device.desc}</p>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* ─── Step 1 (Android): Choose Brand ─── */}
                {step === 1 && showAndroidBrands && (
                    <div>
                        <h2 className="mb-2 text-[32px]">Choose your Android brand</h2>
                        <p className="mb-6 text-base text-ink-soft">Pick the brand that matches your phone. Don't see it? Choose "Other Brand" and we'll follow up directly.</p>
                        <div className="grid gap-6 lg:grid-cols-3">
                            {androidBrandOptions.map((brand) => {
                                const Icon = brand.icon;
                                return (
                                    <button
                                        key={brand.id}
                                        className="premium-card rounded-[28px] p-6 text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-medium sm:rounded-[32px] sm:p-8"
                                        onClick={() => {
                                            markInteraction();
                                            setSelection((prev) => ({ ...prev, device: brand.id, model: '', carrier: '', storage: '', answers: {}, customBrand: '', customModel: '' }));
                                            setConditionStep(0);
                                            setShowAndroidBrands(false);
                                            setStep(2);
                                        }}
                                    >
                                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-alt">
                                            <Icon className="!text-[24px] text-apple-text" />
                                        </div>
                                        <h2 className="text-[28px]">{brand.title}</h2>
                                        <p className="mt-3 text-base leading-8 text-ink-soft">{brand.desc}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ─── Step 2: Choose Model ─── */}
                {step === stepMap['Model'] && (
                    <div>
                        <h2 className="mb-6 text-[32px]">Select your {selection.device} model</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {(modelsByDevice[selection.device] || []).map((model) => (
                                <button
                                    key={model.id}
                                    className="premium-card rounded-[28px] p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-medium"
                                    onClick={() => {
                                        markInteraction();
                                        setSelection((prev) => ({ ...prev, model: model.id }));
                                        next();
                                    }}
                                >
                                    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray">{selection.device}</div>
                                    <h3 className="mt-3 text-[22px] font-bold">{model.title}</h3>
                                    {/* The server's own "up to": the best storage with the
                                        best answers. The page used to guess it as the base
                                        price times 1.45, which was neither the top storage
                                        multiplier nor a number any real device reached. */}
                                    {teaserFor(model.id) ? (
                                        <p className="mt-2 text-sm text-ink-soft">Up to <span className="font-bold text-apple-text">${teaserFor(model.id)}</span></p>
                                    ) : null}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ─── Step: Choose Carrier (only for iPhone / iPad) ─── */}
                {hasCarrier && step === stepMap['Carrier'] && (
                    <div>
                        <h2 className="mb-2 text-[28px] sm:text-[32px]">Select your carrier</h2>
                        <p className="mb-6 text-base text-ink-soft">Choose the carrier your device is currently on or if it's unlocked.</p>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {carrierOptions[selection.device].map((carrier) => (
                                <button
                                    key={carrier.id}
                                    className="premium-card rounded-[28px] p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-medium"
                                    onClick={() => {
                                        markInteraction();
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
                        <h2 className="mb-2 text-[28px] sm:text-[32px]">Select your storage capacity</h2>
                        <p className="mb-6 text-base text-ink-soft">Choose the storage size of your device.</p>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                            {(storageOptions[selection.device] || []).map((storage) => (
                                <button
                                    key={storage}
                                    className="premium-card rounded-[28px] p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-medium"
                                    onClick={() => {
                                        markInteraction();
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
                                    <div className="flex justify-between"><span className="text-ink-soft">Model</span><span className="font-bold text-apple-text">{selectedModelTitle}</span></div>
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
                                    {estimate ? `$${estimate}` : '--'}
                                </div>
                                <p className="mt-2 text-xs leading-5 text-ink-soft">Final value confirmed after inspection.</p>
                            </div>
                        </aside>
                    </div>
                )}



                {/* ─── Step: Your Details (Form + Valuation) ─── */}
                {step === stepMap['Your details'] && selection.device !== 'AndroidOther' && (
                    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                        <div className="space-y-8">
                            {/* Valuation Summary Card */}
                            <div className="premium-card rounded-[28px] p-6 sm:rounded-[36px] sm:p-8 md:p-10 border border-apple-text/10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-50">
                                        <CheckCircleIcon className="!text-[24px] text-green-600" />
                                    </div>
                                    <h2 className="text-[26px] font-bold sm:text-[32px]">Your evaluation is ready</h2>
                                </div>
                                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                    <span className="text-5xl font-extrabold text-apple-text sm:text-6xl">${estimate || 0}</span>
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
                                        <div className="mt-1 font-bold truncate">{selectedModelTitle}</div>
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
                            <div className="premium-card rounded-[28px] p-6 sm:rounded-[36px] sm:p-8 md:p-10">
                                <h3 className="text-[24px] mb-6 sm:text-[28px]">Finalize your details</h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <input className="premium-input w-full" placeholder="Full name" value={selection.name} onChange={(e) => {
                                            markInteraction();
                                            setSelection((prev) => ({ ...prev, name: e.target.value }));
                                        }} />
                                    </div>
                                    <input className="premium-input" type="email" placeholder="Email address" value={selection.email} onChange={(e) => {
                                        markInteraction();
                                        setSelection((prev) => ({ ...prev, email: e.target.value }));
                                    }} />
                                    <input className="premium-input" type="tel" placeholder="Phone number" value={selection.phone} onChange={(e) => {
                                        markInteraction();
                                        setSelection((prev) => ({ ...prev, phone: e.target.value }));
                                    }} />
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

                {/* Step: AndroidOther - Custom Phone Request */}
                {step === stepMap['Your details'] && selection.device === 'AndroidOther' && (
                    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                        <div className="space-y-8">
                            <div className="premium-card rounded-[28px] p-6 sm:rounded-[36px] sm:p-8 md:p-10">
                                <h2 className="text-[26px] font-bold sm:text-[32px]">Tell us about your phone</h2>
                                <p className="mt-3 text-base leading-8 text-ink-soft max-w-[560px]">
                                    We don't have a fixed price list for this device, so our team will review your details and reach out within 1 business day with a personalised offer.
                                </p>

                                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                    <input
                                        className="premium-input"
                                        placeholder="Phone brand (e.g. OnePlus, Xiaomi)"
                                        value={selection.customBrand}
                                        onChange={(e) => {
                                            markInteraction();
                                            setSelection((prev) => ({ ...prev, customBrand: e.target.value }));
                                        }}
                                    />
                                    <input
                                        className="premium-input"
                                        placeholder="Phone model (e.g. 12 Pro, Mi 14)"
                                        value={selection.customModel}
                                        onChange={(e) => {
                                            markInteraction();
                                            setSelection((prev) => ({ ...prev, customModel: e.target.value }));
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="premium-card rounded-[28px] p-6 sm:rounded-[36px] sm:p-8 md:p-10">
                                <h3 className="text-[24px] mb-6 sm:text-[28px]">Your contact details</h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <input className="premium-input w-full" placeholder="Full name" value={selection.name} onChange={(e) => {
                                            markInteraction();
                                            setSelection((prev) => ({ ...prev, name: e.target.value }));
                                        }} />
                                    </div>
                                    <input className="premium-input" type="email" placeholder="Email address" value={selection.email} onChange={(e) => {
                                        markInteraction();
                                        setSelection((prev) => ({ ...prev, email: e.target.value }));
                                    }} />
                                    <input className="premium-input" type="tel" placeholder="Phone number" value={selection.phone} onChange={(e) => {
                                        markInteraction();
                                        setSelection((prev) => ({ ...prev, phone: e.target.value }));
                                    }} />
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
                                    {isSubmitting ? 'Submitting...' : 'Request a quote'}
                                </button>
                            </div>
                        </div>

                        <aside className="space-y-6">
                            <div className="premium-card rounded-[32px] p-6 lg:sticky lg:top-28">
                                <h3 className="text-[22px] mb-6">What happens next</h3>
                                <div className="space-y-5 text-sm leading-7 text-ink-soft">
                                    <p><span className="font-bold text-apple-text">1. We review your phone details.</span> Our team checks current market value for your make and model.</p>
                                    <p><span className="font-bold text-apple-text">2. We reach out within 1 business day</span> with a personalised offer by email or phone.</p>
                                    <p><span className="font-bold text-apple-text">3. You decide.</span> Accept the offer and we'll send a prepaid, insured shipping kit. No obligation.</p>
                                </div>
                            </div>
                        </aside>
                    </div>
                )}

                {/* ─── Step: Confirmation ─── */}
                {step === stepMap['Confirmation'] && (
                    <div className="premium-card rounded-[28px] px-6 py-12 text-center sm:rounded-[36px] sm:px-8 sm:py-16">
                        <CheckCircleIcon className="!text-[72px] text-apple-text" />
                        <h2 className="mt-6 text-[32px] sm:text-[42px]">{selection.device === 'AndroidOther' ? 'Request received.' : 'Trade-in request received.'}</h2>
                        <p className="mx-auto mt-4 max-w-[560px] text-lg leading-8 text-ink-soft">
                            {selection.device === 'AndroidOther'
                                ? "Thanks! Our team will review your phone details and reach out within 1 business day with a personalized offer."
                                : "We'll email your prepaid shipping label, inspection guidance, and next steps within 1 business day. Payout is issued within 24 hours of device inspection."}
                        </p>
                        {selection.device !== 'AndroidOther' && (
                            <div className="mx-auto mt-6 max-w-[400px] rounded-[24px] border border-black/[0.06] bg-surface-alt/50 p-5">
                                <div className="text-sm text-ink-soft">Estimated payout</div>
                                <div className="mt-1 text-3xl font-extrabold text-apple-text">${estimate || 0}</div>
                            </div>
                        )}
                        {savedRequest?._id && (
                            <div className="mx-auto mt-4 max-w-[400px] rounded-[24px] border border-black/[0.06] bg-white p-5 text-left">
                                <div className="text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Request ID</div>
                                <div className="mt-2 break-all text-sm font-bold text-apple-text">{savedRequest._id}</div>
                                <div className="mt-3 text-xs text-ink-soft">Status: {savedRequest.status}</div>
                            </div>
                        )}
                        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
                            <Link to="/shop" className="premium-button w-full sm:w-auto sm:min-w-[200px]">Continue shopping</Link>
                            <button className="premium-button-secondary w-full sm:w-auto sm:min-w-[200px]" onClick={resetFlow}>Start again</button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default TradeIn;
