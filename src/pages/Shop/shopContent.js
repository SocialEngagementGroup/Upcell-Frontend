// Copy for the lower half of the shop page.
//
// This is written for UpCell, not lifted from the reference. Every figure in
// it traces to something the site already publishes:
//
//   40-point inspection  → AboutUs, Contactus, ProductDetailPage
//   12-month warranty    → ReturnPolicy, TermsConditions, ProductDetailPage
//   30-day return window → ReturnPolicy (and it is NOT free — the buyer pays
//                          return shipping unless the fault is UpCell's)
//   grading language     → Contactus, which is the only place grades are
//                          currently defined in words
//
// Nothing here states a customer count, a satisfaction rate, a saving
// percentage or an award, because UpCell has no source for any of those.

// "Popular searches" — the reference's FAQ accordion.
//
// The questions are the ones its list asks, pointed at UpCell's own answers.
// Several are lifted from the Contact page's FAQ, which is where these were
// already answered in the site's own words.
export const FAQS = [
    {
        q: 'What is a Certified Premium device?',
        a: 'A pre-owned Apple device that has been through UpCell’s 40-point inspection, '
            + 'graded for cosmetic condition, factory reset, and listed with that grade stated '
            + 'on the product page. Every one carries a 12-month limited warranty.',
    },
    {
        q: 'How do you grade condition?',
        a: 'Every unit goes through the same 40-point inspection. “Pristine” means no '
            + 'cosmetic wear; “Like New” may carry a single, nearly invisible mark. We do '
            + 'not sell units with cracked glass or structural damage.',
    },
    {
        q: 'What warranty comes with my device?',
        a: 'A 12-month UpCell IT Inc. limited warranty covering internal hardware defects, '
            + 'running from the date of delivery or in-store pickup. Extended protection for '
            + 'accidental damage is available separately.',
        to: '/return-policy',
        linkLabel: 'Read the warranty terms',
    },
    {
        q: 'Can I return it if I change my mind?',
        a: 'Yes — eligible devices can be returned within 30 calendar days of delivery. '
            + 'Contact us first for return authorisation. Unless the return is down to our '
            + 'error or a confirmed defect, return shipping is at your cost and the original '
            + 'shipping charge is not refunded.',
        to: '/return-policy',
        linkLabel: 'Read the return policy',
    },
    {
        q: 'What can I trade in?',
        a: 'iPhone, iPad and MacBook, and also Samsung Galaxy and Google Pixel handsets. '
            + 'Answer a few questions about the model, storage and condition and you get an '
            + 'estimate before you commit to anything.',
        to: '/trade-in',
        linkLabel: 'Get a trade-in estimate',
    },
    {
        q: 'How long does delivery take?',
        a: 'Most orders are processed within one business day. Standard shipping across the US '
            + 'usually takes 3–7 business days, and expedited options are offered at checkout.',
    },
    {
        q: 'Is a refurbished device the same as a used one?',
        a: 'No. A used device is sold as-is by whoever owned it last. Everything here has been '
            + 'inspected against a fixed checklist, graded, reset, and backed by a warranty and '
            + 'a return window — so what arrives matches what the listing said.',
    },
];

// The reference closes on a long block of prose. This is UpCell's own, and it
// deliberately avoids the two things that block usually does: a headline
// savings percentage, and a comparison table against named competitors.
// Neither is something this catalogue can support.
export const SEO_SECTIONS = [
    {
        id: 'why',
        heading: 'Why buy a Certified Premium Apple device?',
        paragraphs: [
            'A Certified Premium device is one that has already had a first life, and has been '
                + 'put back into a condition where it can comfortably have a second. That is a '
                + 'better deal than it sounds: Apple hardware tends to outlast the contract it '
                + 'was bought on, and a two-year-old iPhone or MacBook is usually a long way '
                + 'from the end of its useful life.',
            'What separates one from a second-hand listing is what happens in between. Every '
                + 'device we sell goes through a 40-point inspection, gets graded for cosmetic '
                + 'condition against a fixed scale, and is wiped back to factory settings before '
                + 'it is listed. The grade you read on the product page is the grade that turns '
                + 'up at your door.',
        ],
    },
    {
        id: 'what',
        heading: 'What UpCell sells',
        paragraphs: [
            'We stock Apple: iPhone, iPad and MacBook. That is a deliberate limit rather than a '
                + 'gap. Concentrating on one manufacturer means our inspection checklist, our '
                + 'grading language and our parts knowledge are all pointed at the same hardware, '
                + 'instead of being spread thin across a dozen brands.',
            'Across the range you will find several generations at once, in a spread of storage '
                + 'sizes, colours and condition grades. The oldest models are where the deepest '
                + 'discounts sit; the most recent are where the smallest gap to new is.',
        ],
    },
    {
        id: 'grades',
        heading: 'Understanding the condition grades',
        paragraphs: [
            'Grading describes appearance, not function. A device that does not work correctly '
                + 'does not get graded — it does not get listed. Nothing with cracked glass or '
                + 'structural damage is sold here at any grade.',
            '“Pristine” means no cosmetic wear worth pointing out. “Like New” may carry a '
                + 'single, nearly invisible mark. Further down the scale, marks become easier to '
                + 'find in the right light, and the price moves with them. If two listings differ '
                + 'only in grade, the difference between them is how the device looks, not how it '
                + 'runs.',
        ],
    },
    {
        id: 'saving',
        heading: 'How much you actually save',
        paragraphs: [
            'We do not publish a single headline percentage, because there is not an honest one '
                + 'to publish — the gap depends on the model, its age, its storage and its grade, '
                + 'and it moves as stock changes. Every product page shows its own price against '
                + 'the list price of the equivalent new device, so the comparison you are making '
                + 'is the one that applies to the device in front of you.',
            'The larger savings tend to sit one or two generations back from the newest release, '
                + 'and on the higher storage tiers, where the premium charged when new was '
                + 'steepest.',
        ],
    },
    {
        id: 'trade-in',
        heading: 'What happens to your old device',
        paragraphs: [
            'If you have a device sitting in a drawer, it can go towards this one. Our trade-in '
                + 'covers iPhone, iPad and MacBook, as well as Samsung Galaxy and Google Pixel '
                + 'handsets. You answer a short set of questions about the model, its storage and '
                + 'its condition, and you get an estimate before committing to anything.',
            'It is also the least wasteful thing you can do with it. Manufacturing accounts for '
                + 'the large majority of a phone’s lifetime carbon footprint, so keeping an '
                + 'existing device in service — yours or someone else’s — avoids far more than '
                + 'recycling it ever recovers.',
        ],
    },
];
