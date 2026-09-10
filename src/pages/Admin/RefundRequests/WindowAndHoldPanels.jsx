import React, { useState } from 'react';
import { toast } from 'sonner';
import { TOAST_ICONS } from '../../../utilities/toastIcons';
import { extractApiError } from '../../../utilities/formValidation';
import {
    useOverrideWindowMutation,
    useSetDisputeHoldMutation,
} from '../../../queries/refundRequests';
import { Panel, Field, Area } from './ReturnPanelKit';

const day = (value) => (value ? new Date(value).toLocaleDateString() : '—');

// Where the customer's thirty days were counted from, in words.
//
// Never the order date. A customer who waited two weeks for a phone has not
// used two weeks of their return window, and saying which of the three it was
// is what makes the closing date arguable — or not.
const STARTED_FROM = {
    DELIVERY: 'delivery',
    SHIP_PLUS_3: 'three days after it shipped, because delivery was never confirmed',
    STAFF_OVERRIDE: 'a date set by hand',
};

// Moving the date the window started from.
//
// This decides whether a return is inside the window, so it moves money. With
// two or three staff able to do it, an unexplained override is indistinguishable
// from a favour — which is why the note is required and ten characters long.
export const WindowPanel = ({ request }) => {
    const override = useOverrideWindowMutation();

    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [note, setNote] = useState('');
    const [error, setError] = useState('');

    const window = request.window;

    const submit = () => {
        setError('');
        override.mutate(
            { id: request._id, startDate, note: note.trim() },
            {
                onSuccess: () => {
                    toast.success('Window moved', { icon: TOAST_ICONS.statusChanged });
                    setOpen(false);
                    setStartDate('');
                    setNote('');
                },
                onError: (mutationError) => setError(extractApiError(mutationError)),
            }
        );
    };

    if (!open) {
        return (
            <div className="mt-2 flex flex-wrap items-baseline gap-2 text-xs text-ink-soft">
                <span>
                    {window?.startDate
                        ? `Window ran from ${day(window.startDate)} to ${day(window.expiresAt)} — counted from ${STARTED_FROM[window.startedFrom] || 'delivery'}.`
                        : 'Return window not worked out yet.'}
                </span>
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="font-semibold text-apple-text underline underline-offset-2"
                >
                    Adjust
                </button>
                {window?.overrideNote ? (
                    <span className="w-full text-[11px] text-apple-gray">
                        Moved by {window.overrideBy}: {window.overrideNote}
                    </span>
                ) : null}
            </div>
        );
    }

    return (
        <Panel
            title="Move the start of the window"
            hint="The record is sometimes wrong — a carrier marks a parcel delivered when it reaches a depot, and the customer has an email saying otherwise."
            onSubmit={submit}
            submitLabel="Move it"
            busy={override.isPending}
            disabled={!startDate || note.trim().length < 10}
            error={error}
        >
            <Field label="Started from" hint="A date in the future is refused.">
                <input
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-black/[0.08] bg-white px-3 py-2 text-sm outline-none focus:border-apple-text/25"
                />
            </Field>

            <Field
                label="Why"
                hint="At least a sentence. This moves money, and an override with “ok” in the box cannot be defended months later."
            >
                <Area value={note} onChange={(event) => setNote(event.target.value)} />
            </Field>

            <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs font-semibold text-ink-soft underline underline-offset-2"
            >
                Leave it as it is
            </button>
        </Panel>
    );
};

// Freezing the inspection photos past their ninety days.
//
// A chargeback, or a solicitor's letter, arrives long after the case looks
// closed and the retention clock is nearly up. Lifting the hold deletes
// nothing — the photos simply become eligible again on the next run.
export const DisputeHoldPanel = ({ request }) => {
    const setHold = useSetDisputeHoldMutation();

    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const held = Boolean(request.disputed);
    const photoCount = request.inspection?.photos?.length || 0;

    // Nothing to hold until there is an inspection behind it.
    if (!photoCount && !held) return null;

    const apply = (disputed, why) => {
        setError('');
        setHold.mutate(
            { id: request._id, disputed, ...(why ? { reason: why } : {}) },
            {
                onSuccess: () => {
                    toast.success(
                        disputed ? 'Photos held' : 'Hold lifted — nothing was deleted',
                        { icon: TOAST_ICONS.statusChanged }
                    );
                    setOpen(false);
                    setReason('');
                },
                onError: (mutationError) => setError(extractApiError(mutationError)),
            }
        );
    };

    if (held) {
        return (
            <div className="mt-2 flex flex-wrap items-baseline gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <span className="font-semibold">
                    Photos held — this return is marked disputed.
                </span>
                <button
                    type="button"
                    disabled={setHold.isPending}
                    onClick={() => apply(false)}
                    className="font-semibold underline underline-offset-2 disabled:opacity-50"
                >
                    Lift the hold
                </button>
                {error ? <span className="w-full text-brand-red">{error}</span> : null}
            </div>
        );
    }

    if (!open) {
        return (
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="mt-2 text-xs font-semibold text-ink-soft underline underline-offset-2"
            >
                Hold the {photoCount} inspection photo{photoCount === 1 ? '' : 's'}
            </button>
        );
    }

    return (
        <Panel
            title="Hold the photos"
            hint="They stop being deleted at ninety days and stay until the hold is lifted."
            onSubmit={() => apply(true, reason.trim())}
            submitLabel="Hold them"
            busy={setHold.isPending}
            disabled={reason.trim().length < 5}
            error={error}
        >
            <Field label="Why" hint="A chargeback reference, a case number, or what was said.">
                <Area value={reason} onChange={(event) => setReason(event.target.value)} />
            </Field>

            <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs font-semibold text-ink-soft underline underline-offset-2"
            >
                Cancel
            </button>
        </Panel>
    );
};
