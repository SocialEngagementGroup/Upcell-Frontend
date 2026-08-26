import React, { useMemo, useState } from 'react';
import ScrollToTop from '../../utilities/ScrollToTop';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utilities/axiosInstance';
import { extractApiError, validateEmailAddress, validatePhoneNumber, validateRequiredText } from '../../utilities/formValidation';
import useFormAnalytics from '../../utilities/useFormAnalytics';

/* ───────────── STATIC DATA ───────────── */

const deviceOptions = [
    { id: 'iPhone', title: 'iPhone', desc: 'Trade in any iPhone from the iPhone 11 to the iPhone 16 Pro Max. We accept unlocked and carrier models.' },
    { id: 'iPad', title: 'iPad', desc: 'We accept iPad Air, iPad mini, and iPad Pro. Both Wi-Fi and cellular models are welcome.' },
    { id: 'MacBook', title: 'MacBook', desc: 'Trade in MacBook Air and MacBook Pro models. M1, M2, and M3 chips are all eligible.' },
    { id: 'Android', title: 'Android', desc: 'Trade in your Samsung Galaxy S, Google Pixel, or other Android device.' },
];

const androidBrandOptions = [
    { id: 'Samsung', title: 'Samsung Galaxy', desc: 'Galaxy S series accepted, including the S22 Ultra and newer flagships.' },
    { id: 'Google', title: 'Google Pixel', desc: 'Pixel 8 and newer Pixel devices accepted.' },
    { id: 'AndroidOther', title: 'Other Brand', desc: "Different brand or model? Tell us about it and our team will reach out with an offer." },
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
    'Samsung': [
        { id: 's25ultra', title: 'Galaxy S25 Ultra' },
        { id: 's25plus', title: 'Galaxy S25+' },
        { id: 's25', title: 'Galaxy S25' },
        { id: 's24ultra', title: 'Galaxy S24 Ultra' },
        { id: 's24plus', title: 'Galaxy S24+' },
        { id: 's24', title: 'Galaxy S24' },
        { id: 's23ultra', title: 'Galaxy S23 Ultra' },
        { id: 's23plus', title: 'Galaxy S23+' },
        { id: 's23', title: 'Galaxy S23' },
        { id: 's22ultra', title: 'Galaxy S22 Ultra' },
    ],
    'Google': [
        { id: 'pixel9proxl', title: 'Pixel 9 Pro XL' },
        { id: 'pixel9pro', title: 'Pixel 9 Pro' },
        { id: 'pixel9', title: 'Pixel 9' },
        { id: 'pixel9a', title: 'Pixel 9a' },
        { id: 'pixel8pro', title: 'Pixel 8 Pro' },
        { id: 'pixel8', title: 'Pixel 8' },
        { id: 'pixel8a', title: 'Pixel 8a' },
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
    'Samsung': [
        { id: 'powersOn', question: 'Does the device power on and hold a charge?', yes: 'Yes, it powers on normally', no: 'No, it won\'t turn on' },
        { id: 'functional', question: 'Is the device fully functional?', subtitle: 'All buttons, touch, fingerprint/face unlock, cameras, and speakers work normally.', yes: 'Yes, everything works', no: 'No, something is broken' },
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
    'Google': [
        { id: 'powersOn', question: 'Does the device power on and hold a charge?', yes: 'Yes, it powers on normally', no: 'No, it won\'t turn on' },
        { id: 'functional', question: 'Is the device fully functional?', subtitle: 'All buttons, touch, fingerprint/face unlock, cameras, and speakers work normally.', yes: 'Yes, everything works', no: 'No, something is broken' },
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
    's25ultra': 850, 's25plus': 620, 's25': 520,
    's24ultra': 700, 's24plus': 520, 's24': 440,
    's23ultra': 540, 's23plus': 380, 's23': 320,
    's22ultra': 360,
    'pixel9proxl': 720, 'pixel9pro': 620, 'pixel9': 480, 'pixel9a': 340,
    'pixel8pro': 480, 'pixel8': 360, 'pixel8a': 280,
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

    const estimate = useMemo(() => calculateEstimate(selection), [selection]);

    const currentQuestions = conditionQuestions[selection.device] || [];
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
    const selectedModelTitle = (modelOptions[selection.device] || []).find((model) => model.id === selection.model)?.title || '';
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

    // TODO(redesign): build the new trade-in wizard UI here. The full step
    // machine, pricing engine, condition questions and submit flow above are
    // wired and working — only the presentation was removed.
    const currentStepLabel = stepLabels[step - 1];

    return (
        <div>
            <ScrollToTop />

            <nav>
                <Link to="/">Home</Link>
                <span>Trade In</span>
            </nav>

            <h1>Trade In Your Apple Device</h1>
            <p>
                Get an instant trade-in quote. Free prepaid shipping, fully insured transit, and
                payout within 24 hours of inspection.
            </p>

            {/* Step indicator */}
            <ol>
                {stepLabels.map((label, index) => (
                    <li key={label} aria-current={index + 1 === step ? 'step' : undefined}>
                        {label}
                    </li>
                ))}
            </ol>

            {/* Step 1 — device / android brand picker */}
            {step === 1 && (
                <fieldset>
                    <legend>{showAndroidBrands ? 'Choose your Android brand' : 'Choose your device'}</legend>
                    {(showAndroidBrands ? androidBrandOptions : deviceOptions).map((option) => (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                                markInteraction();
                                if (option.id === 'Android') {
                                    setShowAndroidBrands(true);
                                    return;
                                }
                                setSelection((prev) => ({ ...prev, device: option.id }));
                                next();
                            }}
                        >
                            <strong>{option.title}</strong>
                            <span>{option.desc}</span>
                        </button>
                    ))}
                </fieldset>
            )}

            {/* Model */}
            {step === stepMap['Model'] && (
                <fieldset>
                    <legend>Choose your model</legend>
                    {(modelOptions[selection.device] || []).map((model) => (
                        <button
                            key={model.id}
                            type="button"
                            onClick={() => {
                                markInteraction();
                                setSelection((prev) => ({ ...prev, model: model.id }));
                                next();
                            }}
                        >
                            {model.title}
                        </button>
                    ))}
                </fieldset>
            )}

            {/* Carrier */}
            {hasCarrier && step === stepMap['Carrier'] && (
                <fieldset>
                    <legend>Choose your carrier</legend>
                    {(carrierOptions[selection.device] || []).map((carrier) => (
                        <button
                            key={carrier.id}
                            type="button"
                            onClick={() => {
                                markInteraction();
                                setSelection((prev) => ({ ...prev, carrier: carrier.id }));
                                next();
                            }}
                        >
                            {carrier.title}
                        </button>
                    ))}
                </fieldset>
            )}

            {/* Storage */}
            {step === stepMap['Storage'] && (
                <fieldset>
                    <legend>Choose your storage</legend>
                    {(storageOptions[selection.device] || []).map((storage) => (
                        <button
                            key={storage}
                            type="button"
                            onClick={() => {
                                markInteraction();
                                setSelection((prev) => ({ ...prev, storage }));
                                next();
                            }}
                        >
                            {storage}
                        </button>
                    ))}
                </fieldset>
            )}

            {/* Condition questions */}
            {step === stepMap['Condition'] && currentQuestion && (
                <fieldset>
                    <legend>{currentQuestion.question}</legend>
                    {currentQuestion.options.map((option) => (
                        <button
                            key={String(option.value)}
                            type="button"
                            onClick={() => handleConditionAnswer(currentQuestion.id, option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </fieldset>
            )}

            {/* Details */}
            {step === stepMap['Your details'] && (
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleSubmitTradeInRequest();
                    }}
                >
                    <fieldset>
                        <legend>Your details</legend>

                        {selection.device === 'AndroidOther' && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Phone brand"
                                    value={selection.customBrand}
                                    onChange={(event) => setSelection((prev) => ({ ...prev, customBrand: event.target.value }))}
                                />
                                <input
                                    type="text"
                                    placeholder="Phone model"
                                    value={selection.customModel}
                                    onChange={(event) => setSelection((prev) => ({ ...prev, customModel: event.target.value }))}
                                />
                            </>
                        )}

                        <input
                            type="text"
                            placeholder="Full name"
                            value={selection.name}
                            onChange={(event) => setSelection((prev) => ({ ...prev, name: event.target.value }))}
                        />
                        <input
                            type="email"
                            placeholder="Email address"
                            value={selection.email}
                            onChange={(event) => setSelection((prev) => ({ ...prev, email: event.target.value }))}
                        />
                        <input
                            type="tel"
                            placeholder="Phone number"
                            value={selection.phone}
                            onChange={(event) => setSelection((prev) => ({ ...prev, phone: event.target.value }))}
                        />
                    </fieldset>

                    {typeof estimate === 'number' && <p>Estimated value: ${estimate}</p>}
                    {submitError && <p role="alert">{submitError}</p>}

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit trade-in request'}
                    </button>
                </form>
            )}

            {/* Confirmation */}
            {step === stepMap['Confirmation'] && (
                <div>
                    <h2>Trade-in request received.</h2>
                    {savedRequest?.referenceId && <p>Reference: {savedRequest.referenceId}</p>}
                    {selectedModelTitle && <p>Device: {selectedModelTitle}</p>}
                    {selectedCarrierTitle && <p>Carrier: {selectedCarrierTitle}</p>}
                    {typeof estimate === 'number' && <p>Estimated value: ${estimate}</p>}
                    <button type="button" onClick={resetFlow}>Start another trade-in</button>
                    <Link to="/shop">Shop premium Apple</Link>
                </div>
            )}

            {/* Wizard navigation */}
            {step > 1 && step !== stepMap['Confirmation'] && (
                <button type="button" onClick={back}>Back</button>
            )}

            <p>
                Step {step} of {totalSteps}
                {currentStepLabel ? ` — ${currentStepLabel}` : ''}
                {allConditionAnswered && step === stepMap['Condition'] ? ' (condition complete)' : ''}
            </p>
        </div>
    );
};

export default TradeIn;
