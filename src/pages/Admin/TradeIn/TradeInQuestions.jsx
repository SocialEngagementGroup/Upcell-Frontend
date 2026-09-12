import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AdminPageHeader from '../../../components/AdminPageHeader/AdminPageHeader';
import AdminLoadingState from '../../../components/AdminState/AdminLoadingState';
import AdminEmptyState from '../../../components/AdminState/AdminEmptyState';
import { extractApiError } from '../../../utilities/formValidation';
import { usePriceBookQuery, useUpdateQuestionSetMutation } from '../../../queries/tradeIn';

// The condition questions a customer answers, and what each answer is worth.
//
// This is where a wrong quote usually comes from. A question a customer reads
// differently from the way it was meant — "is the screen cracked" answered no
// for a hairline — produces a quote the device cannot live up to, and then a
// revised offer and an argument. The trade-in report shows which model that
// keeps happening to; this page is where it gets fixed.
//
// Saved as a whole set per device type, matching the API. That is the one place
// a bulk write is right: the multipliers compound, so half a set is a quote
// nobody intended.

const DEVICE_TYPES = ['iPhone', 'iPad', 'MacBook', 'Samsung', 'Google'];

// The multiplier a whole quote is made of. Shown as a percentage because that
// is how somebody setting one thinks about it — "a cracked screen is worth 55%
// of a clean one" rather than "0.55".
const asPercent = (multiplier) => Math.round((Number(multiplier) || 0) * 100);
const fromPercent = (percent) => Math.round(Number(percent) || 0) / 100;

const OptionRow = ({ option, onChange }) => (
    <div className="grid gap-2 border-t border-black/[0.06] pt-2 md:grid-cols-[1fr_120px]">
        <div>
            <input
                className="admin-input"
                value={option.title}
                onChange={(event) => onChange({ title: event.target.value })}
                placeholder="What the customer picks"
            />
            <input
                className="admin-input mt-1.5 text-xs"
                value={option.desc || ''}
                onChange={(event) => onChange({ desc: event.target.value })}
                placeholder="The smaller line under it (optional)"
            />
        </div>
        <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-apple-gray">Worth</span>
            <div className="mt-1.5 flex items-center gap-1">
                <input
                    className="admin-input"
                    type="number"
                    min="0"
                    max="100"
                    value={asPercent(option.multiplier)}
                    onChange={(event) => onChange({ multiplier: fromPercent(event.target.value) })}
                />
                <span className="text-sm text-ink-soft">%</span>
            </div>
        </label>
    </div>
);

const QuestionCard = ({ question, onChange }) => (
    <div className="rounded-[24px] border border-black/[0.06] bg-white p-4">
        <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-apple-gray">Question</span>
            <input
                className="admin-input mt-1.5"
                value={question.question}
                onChange={(event) => onChange({ question: event.target.value })}
            />
        </label>

        <label className="mt-2 block">
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-apple-gray">Smaller line under it</span>
            <input
                className="admin-input mt-1.5"
                value={question.subtitle || ''}
                onChange={(event) => onChange({ subtitle: event.target.value })}
            />
        </label>

        <p className="mt-2 font-mono text-[11px] text-apple-gray">
            {question.id} · {question.type}
            {question.terminal ? ' · ends the quote' : ''}
        </p>

        {question.type === 'boolean' ? (
            <label className="mt-3 block">
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-apple-gray">
                    Worth, if they answer no
                </span>
                <div className="mt-1.5 flex items-center gap-1">
                    <input
                        className="admin-input max-w-[140px]"
                        type="number"
                        min="0"
                        max="100"
                        value={asPercent(question.noMultiplier)}
                        onChange={(event) => onChange({ noMultiplier: fromPercent(event.target.value) })}
                    />
                    <span className="text-sm text-ink-soft">%</span>
                </div>
                <span className="mt-1 block text-[11px] leading-4 text-ink-soft">
                    Yes is always 100% — it is what the base price assumes, so nothing can be worth more than it.
                </span>
            </label>
        ) : (
            <div className="mt-3 space-y-2">
                {(question.options || []).map((option, index) => (
                    <OptionRow
                        key={option.id || index}
                        option={option}
                        onChange={(patch) => onChange({
                            options: question.options.map((existing, i) =>
                                (i === index ? { ...existing, ...patch } : existing)),
                        })}
                    />
                ))}
            </div>
        )}

        {question.terminal ? (
            <p className="mt-3 rounded-xl bg-surface-alt px-3 py-2 text-[11px] leading-4 text-ink-soft">
                A bad answer here stops the quote rather than reducing it — this is the question that decides
                whether UpCell can take the device at all.
            </p>
        ) : null}
    </div>
);

const TradeInQuestions = () => {
    const [deviceType, setDeviceType] = useState('iPhone');
    const [draft, setDraft] = useState(null);
    const [error, setError] = useState('');

    const { data, isLoading } = usePriceBookQuery();
    const save = useUpdateQuestionSetMutation();

    const saved = (data?.questions || []).find((set) => set.deviceType === deviceType);

    // Reloaded whenever the device type changes or the server sends a new copy,
    // so switching tabs cannot carry half an edit across to another set.
    useEffect(() => {
        setDraft(saved?.questions ? JSON.parse(JSON.stringify(saved.questions)) : null);
        setError('');
    }, [deviceType, saved?.updatedAt]);

    const update = (index, patch) =>
        setDraft((prev) => prev.map((question, i) => (i === index ? { ...question, ...patch } : question)));

    const submit = () => {
        setError('');
        save.mutate(
            { deviceType, questions: draft },
            {
                onSuccess: () => toast.success(`${deviceType} questions saved`),
                onError: (failure) => setError(extractApiError(failure)),
            }
        );
    };

    return (
        <section className="space-y-6">
            <AdminPageHeader
                eyebrow="Trade In"
                title="What we ask."
                description="The condition questions, and what each answer is worth. This is usually where a wrong quote comes from — a question read differently from the way it was meant produces a quote the device cannot live up to."
            />

            <div className="admin-panel rounded-[36px] p-6 md:p-8">
                <div className="flex flex-wrap gap-2">
                    {DEVICE_TYPES.map((type) => (
                        <button
                            key={type}
                            type="button"
                            className={deviceType === type ? 'premium-button px-5' : 'premium-button-secondary px-5'}
                            onClick={() => setDeviceType(type)}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <AdminLoadingState title="Loading the questions" description="Pulling the condition questions." />
            ) : draft?.length ? (
                <>
                    <div className="space-y-4">
                        {draft.map((question, index) => (
                            <QuestionCard
                                key={question.id || index}
                                question={question}
                                onChange={(patch) => update(index, patch)}
                            />
                        ))}
                    </div>

                    {error ? (
                        <p className="rounded-xl bg-brand-red/10 px-3 py-2 text-xs font-semibold text-brand-red" role="alert">
                            {error}
                        </p>
                    ) : null}

                    <div className="admin-panel rounded-[36px] p-6 md:p-8">
                        <p className="text-sm leading-7 text-ink-soft">
                            The whole set is saved together, because the multipliers compound — half a set is a quote
                            nobody intended. Quotes already given keep the numbers they were given.
                        </p>
                        <button
                            className="premium-button mt-4 px-6"
                            type="button"
                            onClick={submit}
                            disabled={save.isPending}
                        >
                            {save.isPending ? 'Saving…' : `Save the ${deviceType} questions`}
                        </button>
                    </div>
                </>
            ) : (
                <AdminEmptyState
                    title={`No questions for ${deviceType} yet.`}
                    description="Question sets are seeded by scripts/seed-trade-in-pricebook.js. This page edits them; it does not create a new set."
                />
            )}
        </section>
    );
};

export default TradeInQuestions;
