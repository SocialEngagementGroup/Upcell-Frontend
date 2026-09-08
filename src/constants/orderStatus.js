// Single source of truth for order statuses in the admin UI.
//
// These values must match the backend exactly — statusEnum in
// src/models/order.model.js and ORDER_STATUS_VALUES in
// src/controllers/order.controller.js. The admin orders panel filters by
// exact string match (GET /admin-orders/:status), so a status the backend can
// write but this file does not list becomes an order that no tab can reach.
// That is precisely how "pending_payment" orders went invisible.
export const ORDER_STATUS = {
    PENDING_PAYMENT: 'pending_payment',
    UNDER_REVIEW: 'under_review',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    RETURNED: 'Returned',
    REFUNDED: 'Refunded',
    PAYMENT_FAILED: 'payment failed',
};

// Tab order in the admin orders panel. Pending payment leads because those are
// the only orders actually waiting on an admin decision.
export const ORDER_STATUS_TABS = [
    ORDER_STATUS.PENDING_PAYMENT,
    ORDER_STATUS.UNDER_REVIEW,
    ORDER_STATUS.PROCESSING,
    ORDER_STATUS.SHIPPED,
    ORDER_STATUS.DELIVERED,
    ORDER_STATUS.RETURNED,
    ORDER_STATUS.REFUNDED,
    ORDER_STATUS.PAYMENT_FAILED,
];

// The stored values are inconsistently cased (snake_case, lowercase,
// TitleCase) because they accumulated over time, and "Processing" has always
// been surfaced to admins as "Paid". Display names live here so the raw values
// can stay untouched — renaming them would require a data migration.
const ORDER_STATUS_LABELS = {
    [ORDER_STATUS.PENDING_PAYMENT]: 'Pending Payment',
    [ORDER_STATUS.UNDER_REVIEW]: 'Under Review',
    [ORDER_STATUS.PROCESSING]: 'Paid',
    [ORDER_STATUS.PAYMENT_FAILED]: 'Payment Failed',
};

export const orderStatusLabel = (status) => ORDER_STATUS_LABELS[status] || status;

// The status dropdown offers every status the backend accepts — the same set
// as the tabs above. Admins correct orders in both directions (a payment
// confirmed late, a status clicked by mistake), so restricting the moves
// available from any given status just creates orders that get stranded with
// no way back. The backend allowlist (ORDER_STATUS_VALUES) is the real guard.
export const ORDER_STATUS_OPTIONS = ORDER_STATUS_TABS;

// Payment presentation is derived from status as well as the paid flag,
// because update-order-status only writes status — it does not set paid. An
// order an admin has confirmed into Processing therefore still carries
// paid:false, and must not be shown to them as "Failed".
export const paymentDisplay = ({ paid, status }) => {
    // Checked before the paid branch below: a refunded order still carries
    // paid:true — the charge did happen, and that is deliberate so the order
    // stays on the customer's own list — but showing it as "Completed" next
    // to a status of Refunded tells the admin the opposite of what occurred.
    if (status === ORDER_STATUS.REFUNDED) return { text: 'Refunded', className: 'text-apple-gray' };
    if (paid) return { text: 'Completed', className: 'text-green-600' };
    if (status === ORDER_STATUS.PENDING_PAYMENT) return { text: 'Awaiting confirmation', className: 'text-amber-600' };
    // The bank is checking this payment by hand. Not failed, not confirmed —
    // and the devices stay held until it resolves, so it needs saying plainly.
    if (status === ORDER_STATUS.UNDER_REVIEW) return { text: 'Bank is reviewing', className: 'text-amber-600' };
    if (status === ORDER_STATUS.PAYMENT_FAILED) return { text: 'Failed', className: 'text-red-600' };
    return { text: 'Confirmed by admin', className: 'text-amber-600' };
};
