// Canned quick-question shortcuts — answered instantly on the client, no AI call.
// Facts here must stay in sync with Documentation's Terms & Conditions / Delivery Policy content.
const quickQuestions = [
    {
        id: 'shipping',
        label: 'Shipping & delivery',
        question: 'What are your shipping options?',
        answer: 'Standard shipping (3–7 business days) is free. Priority and priority overnight are available at checkout for an extra fee. Local pickup is also available in Columbus, OH.',
    },
    {
        id: 'returns',
        label: 'Returns & warranty',
        question: 'What is your return and warranty policy?',
        answer: 'Eligible devices can be returned within 14 days of delivery, and every device includes a 12-month limited warranty covering hardware and workmanship defects.',
    },
    {
        id: 'trade-in',
        label: 'Trade-in program',
        question: 'How does the trade-in program work?',
        answer: 'Answer a short condition questionnaire for an instant quote, ship us your device, and we pay out by bank transfer within 2 business days of verifying it.',
    },
    {
        id: 'human',
        label: 'Talk to a person',
        question: 'Can I talk to a human?',
        answer: "Of course — you can email us any time, or use the support link below and our team will pick it up.",
        escalate: true,
    },
];

export default quickQuestions;
