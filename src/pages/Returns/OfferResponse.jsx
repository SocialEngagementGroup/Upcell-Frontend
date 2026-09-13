import React, { useState } from 'react';
import Seo from '../../components/Seo/Seo';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import { useRevisedOfferQuery, useRespondToOfferMutation } from '../../queries/refundRequests';
import { extractApiError } from '../../utilities/formValidation';
import RouteLoadingScreen from '../../components/RouteLoadingScreen/RouteLoadingScreen';

const money = (value) => `$${Number(value || 0).toFixed(2)}`;
const day = (value) => (value ? new Date(value).toLocaleDateString() : null);

const Shell = ({ children }) => (
    <div className="page-shell">
            <Seo title="Your return" noIndex />
        <section className="page-container py-16">
            <div className="premium-card mx-auto max-w-[640px] rounded-[32px] px-6 py-12 sm:rounded-[40px] sm:px-10">
                {children}
            </div>
        </section>
    </div>
);

const Outcome = ({ tone, title, children }) => (
    <div className="text-center">
        <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                tone === 'good' ? 'bg-apple-text/[0.06] text-apple-text' : 'bg-brand-red/10 text-brand-red'
            }`}
        >
            {tone === 'good' ? <CheckCircleIcon className="!text-[32px]" /> : <ReportProblemOutlinedIcon className="!text-[32px]" />}
        </div>
        <h1 className="mt-6 text-[clamp(1.7rem,4vw,2.4rem)] font-extrabold text-apple-text">{title}</h1>
        <div className="mx-auto mt-3 max-w-[440px] text-base leading-7 text-ink-soft">{children}</div>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link to="/shop" className="premium-button w-full sm:w-auto">Continue shopping</Link>
            <Link to="/support" className="premium-button-secondary w-full sm:w-auto">Contact support</Link>
        </div>
    </div>
);

// Where a customer answers a reduced refund offer.
//
// The link in the email is the only way in — no sign-in. It arrives on a phone
// weeks after they last used the site, and a login wall here is how an offer
// times out and a device gets posted back for no reason. The unguessable token
// on the request is what authorises it, and it grants exactly this one return.
//
// Nothing is submitted on load, even though the customer already clicked
// "Accept" in their email. Mail clients and security scanners follow links,
// and this one moves money. The amount and the deductions are shown again and
// a second, deliberate click sends it.
const OfferResponse = () => {
    const { id, decision } = useParams();
    const [params] = useSearchParams();
    const token = params.get('token');

    const { data: offer, isLoading, isError, error } = useRevisedOfferQuery(id, token);
    const respond = useRespondToOfferMutation();

    const [answered, setAnswered] = useState(null);
    const [failure, setFailure] = useState('');

    const accepting = decision === 'accept';

    if (isLoading) return <RouteLoadingScreen />;

    if (isError) {
        // 404 covers a bad token, an unknown id and a deleted return, on
        // purpose — the API will not say which.
        return (
            <Shell>
                <Outcome tone="bad" title="This link is not valid.">
                    {extractApiError(error) || 'It may have expired, or been replaced by a newer email.'}{' '}
                    Contact support with your RMA number and we will sort it out.
                </Outcome>
            </Shell>
        );
    }

    if (answered) {
        return (
            <Shell>
                {answered.decision === 'accept' ? (
                    <Outcome tone="good" title="Offer accepted.">
                        We will refund {money(answered.amount)} to your original payment method.
                        You will get an email when it has been sent.
                    </Outcome>
                ) : (
                    <Outcome tone="good" title="Offer declined.">
                        Your device is on its way back to you at our cost. We will email the
                        tracking number as soon as it is booked.
                    </Outcome>
                )}
            </Shell>
        );
    }

    if (!offer.answerable) {
        return (
            <Shell>
                <Outcome tone="bad" title={offer.expired ? 'This offer has expired.' : 'This offer has already been answered.'}>
                    {offer.expired
                        ? 'It ran out after five days without an answer, so your device is on its way back to you at our cost.'
                        : `Nothing more is needed from you — ${offer.rmaNumber} is now ${offer.status}.`}
                </Outcome>
            </Shell>
        );
    }

    const send = () => {
        setFailure('');
        respond.mutate(
            { id, decision, token },
            {
                onSuccess: (result) => setAnswered(result),
                onError: (mutationError) => setFailure(extractApiError(mutationError)),
            }
        );
    };

    return (
        <Shell>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-red">{offer.rmaNumber}</p>
            <h1 className="mt-3 text-[clamp(1.7rem,4vw,2.4rem)] font-extrabold leading-tight text-apple-text">
                {accepting ? 'Accept the revised refund?' : 'Decline and get the device back?'}
            </h1>
            {offer.productName ? (
                <p className="mt-2 text-sm font-semibold text-ink-soft">{offer.productName}</p>
            ) : null}

            <div className="mt-8 space-y-3 rounded-[24px] bg-surface-alt p-5 text-sm text-ink-soft">
                <div className="flex justify-between">
                    <span>Full refund</span>
                    <strong className="text-apple-text">{money(offer.originalAmount)}</strong>
                </div>

                {offer.deductions.map((deduction, index) => (
                    <div key={index} className="flex justify-between gap-4">
                        <span className="flex-1">{deduction.reason}</span>
                        <strong className="whitespace-nowrap text-brand-red">−{money(deduction.amount)}</strong>
                    </div>
                ))}

                <div className="flex justify-between border-t border-black/[0.08] pt-3 text-base">
                    <span className="font-bold text-apple-text">Revised refund</span>
                    <strong className="text-2xl text-apple-text">{money(offer.offeredAmount)}</strong>
                </div>
            </div>

            {offer.findings ? (
                <div className="mt-5 rounded-[20px] border border-black/[0.06] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-apple-gray">What we found</p>
                    <p className="mt-2 text-sm leading-6 text-ink-soft">{offer.findings}</p>
                </div>
            ) : null}

            <p className="mt-5 text-sm leading-6 text-ink-soft">
                {accepting
                    ? 'We will refund the revised amount to your original payment method and keep the device.'
                    : 'We will send the device back to you at our cost and no refund will be made.'}
                {day(offer.offerExpiresAt) ? ` This offer stands until ${day(offer.offerExpiresAt)}.` : ''}
            </p>

            {failure ? <p className="mt-4 text-sm font-semibold text-brand-red">{failure}</p> : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <button
                    type="button"
                    onClick={send}
                    disabled={respond.isPending}
                    className="premium-button w-full disabled:opacity-50 sm:w-auto"
                >
                    {respond.isPending ? 'Sending…' : accepting ? `Accept ${money(offer.offeredAmount)}` : 'Decline and return my device'}
                </button>

                {/* The other answer, one click away. A customer who tapped the
                    wrong button in their email should not have to find the
                    other one again. */}
                <Link
                    to={`/returns/${id}/${accepting ? 'decline' : 'accept'}?token=${encodeURIComponent(token || '')}`}
                    className="premium-button-secondary w-full text-center sm:w-auto"
                >
                    {accepting ? 'Decline instead' : 'Accept instead'}
                </Link>
            </div>
        </Shell>
    );
};

export default OfferResponse;
