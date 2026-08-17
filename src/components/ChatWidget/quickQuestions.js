// Canned quick-question shortcuts — answered instantly on the client, no AI call.
//
// These are the one place a customer-facing answer bypasses every server-side
// control, so they are held to the same rule as the bot itself: state only what
// the website states, and never a figure the site contradicts itself on. The
// server's copy of the same facts is Backend/src/services/chat/siteKnowledge.js —
// change both together, or the widget and the assistant start disagreeing.
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
        // 30 days matches both the Return Policy page and Terms & Conditions §6
        // (the two disagreed until 14 Aug 2026). Change all three together.
        answer: 'You have 30 days from delivery to return an eligible device, and every device includes a 12-month limited warranty covering hardware and workmanship defects. Returns need to be authorised first — email us with your order number and we\'ll send the next steps.',
    },
    {
        id: 'trade-in',
        label: 'Trade-in program',
        question: 'How does the trade-in program work?',
        // The "2 business days" payout promise that used to be here appears
        // nowhere on the site — Terms & Conditions §4 only says payment is
        // issued once verification is complete.
        answer: 'Answer a short condition questionnaire for an instant quote, then ship us your device or drop it off. We inspect and verify it, and payment is issued once verification is complete. The instant quote is an estimate — the final payout comes from the inspection.',
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
