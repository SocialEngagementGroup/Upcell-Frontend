import visa from '../assets/visa.svg';
import mastercard from '../assets/master.svg';
import discover from '../assets/discover.svg';

// The card networks UpCell shows on the site.
//
// One list, read by all three places that display them: the checkout summary,
// the footer, and the payment information page. They had three copies, which
// is how they came to disagree with the Terms — which says Visa, Mastercard
// and American Express, while every logo shows Visa, Mastercard and Discover.
//
// BLOCKED: D13. Amex came off checkout because nobody had confirmed it was on
// the merchant agreement. Discover went on because it is on the bank's *test*
// card list, which is not the same thing and carries the same open question.
// Ashraf is confirming with BofA which networks are actually on the agreement
// (X11 in PIPELINE.md); this list and the Terms line change together once
// that answer exists, and not before.
export const CARD_BRANDS = [
    { id: 'visa', src: visa, label: 'Visa accepted' },
    { id: 'mastercard', src: mastercard, label: 'Mastercard accepted' },
    { id: 'discover', src: discover, label: 'Discover accepted' },
];

// Whether to show them at all.
//
// Off by default, and that is the point. Displaying a card network's mark is a
// claim that UpCell can take that card, and making it before the merchant
// agreement is confirmed is the kind of thing a card scheme objects to. The
// flag turns them on the day the answer arrives, without a code change.
export const showCardBrands = () => import.meta.env.VITE_SHOW_CARD_BRANDS === 'true';
