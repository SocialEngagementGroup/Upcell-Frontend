// Footer link columns.
//
// Five columns with the reference's headings, but only destinations that exist
// in src/main.jsx. The reference fills these with a press office, a seller
// portal, a student programme, gift guides and Black Friday pages; UpCell has
// none of those, so each column carries what UpCell actually has rather than
// links that would 404.
//
// `withSocials` and `withPayments` mark the two columns that carry extra
// content beneath their links, exactly as the reference does — socials under
// About, payment methods under Services.
export const FOOTER_COLUMNS = [
    {
        id: 'about',
        title: 'About',
        withSocials: true,
        links: [
            { label: 'About us', to: '/about' },
            { label: 'My account', to: '/myaccount' },
        ],
    },
    {
        id: 'help',
        title: 'Help',
        links: [
            { label: 'Contact us', to: '/support' },
            { label: 'Shipping', to: '/delivery-policy' },
            { label: 'Returns and refunds', to: '/return-policy' },
        ],
    },
    {
        id: 'services',
        title: 'Services',
        withPayments: true,
        links: [
            { label: 'Trade-in', to: '/trade-in' },
            { label: 'Shop all devices', to: '/shop' },
            { label: 'Promotions', to: '/promotions' },
        ],
    },
    {
        id: 'resources',
        title: 'Resources',
        links: [
            { label: 'Tech Journal', to: '/blogs' },
            { label: 'iPhone', to: '/shop?category=iPhone' },
            { label: 'iPad', to: '/shop?category=iPad' },
            { label: 'MacBook', to: '/shop?category=MacBook' },
        ],
    },
    {
        id: 'legal',
        title: 'Law and order',
        links: [
            { label: 'Terms and conditions', to: '/terms-conditions' },
            { label: 'Privacy policy', to: '/privacy-policy' },
            { label: 'Payment info', to: '/payment-info' },
        ],
    },
];

// NOTE: no trust badges beside the last column.
//
// The reference sits a B Corp mark and a BBB Accredited Business seal there.
// Those are certifications granted to a specific company after assessment —
// showing either one without holding it is a false credential, not a design
// choice. Add them here only once UpCell has actually been certified.

// TODO: these are the URLs the live footer already uses, and they point at the
// platforms' front pages rather than at UpCell's accounts — clicking one lands
// a visitor on instagram.com, not on UpCell. Replace each with the real
// handle, or drop the row.
export const FOOTER_SOCIALS = [
    { id: 'instagram', label: 'Instagram', href: 'https://instagram.com' },
    { id: 'facebook', label: 'Facebook', href: 'https://facebook.com' },
    { id: 'twitter', label: 'X', href: 'https://twitter.com' },
];

export const FOOTER_PHONE = { label: '+1 380 266 3942', href: 'tel:+13802663942' };

// Written out rather than shown as card logos: the brand marks are licensed
// artwork and this project holds none of the files. The list matches what
// PaymentInfo.jsx actually says UpCell accepts.
export const PAYMENT_METHODS = ['Visa', 'Mastercard', 'American Express', 'Bank transfer'];
