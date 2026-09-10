import React, { useState } from 'react';
import { toast } from 'sonner';
import { TOAST_ICONS } from '../../../utilities/toastIcons';
import { extractApiError } from '../../../utilities/formValidation';
import {
    useInspectionChecklistQuery,
    useSubmitInspectionMutation,
} from '../../../queries/refundRequests';
import { uploadProductImage } from '../../../utilities/uploadImage';
import { Panel, Field, Area, Num, Select } from './ReturnPanelKit';

const REQUIRED_PHOTOS = 5;

const RESULTS = [
    { value: 'pass', label: 'Pass' },
    { value: 'fail', label: 'Fail' },
    { value: 'na', label: 'N/A' },
];

// The bench form. Eleven checks, five photos, and no way to submit half of it.
//
// The checklist comes from the server rather than being written here, so the
// questions on screen and the ones the server demands are one list — a second
// copy drifts, and the copy that drifts is always the one in front of the
// person filling it in.
const InspectionPanel = ({ request }) => {
    const { data: checklist } = useInspectionChecklistQuery();
    const submitInspection = useSubmitInspectionMutation();

    const [answers, setAnswers] = useState({});
    // Two checks answer with a reading rather than a verdict: the battery
    // percentage, and the cosmetic grade. Held apart from the pass/fail
    // answers because they are different shapes, not different values.
    const [battery, setBattery] = useState('');
    const [cosmetic, setCosmetic] = useState('');
    const [photos, setPhotos] = useState([]);
    const [findings, setFindings] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [details, setDetails] = useState([]);

    const items = checklist?.items || [];
    const faultClaimed = request.reasonCategory === 'PRODUCT_FAULT';

    // A change-of-mind return has no fault to reproduce, and asking anyway
    // trains people to answer "N/A" eleven times — which is how a checklist
    // stops being read.
    const visibleItems = items.filter((item) => !item.onlyWhenFaultClaimed || faultClaimed);
    const grades = checklist?.grades || [];

    // A measured or graded check is answered by its reading, not by a button.
    const answerFor = (item) => {
        if (item.measured) return battery !== '' ? battery : '';
        if (item.graded) return cosmetic;
        return answers[item.key] || '';
    };
    const unanswered = visibleItems.filter((item) => !answerFor(item)).length;

    const addPhotos = async (fileList) => {
        const files = Array.from(fileList).filter((file) => file.type.startsWith('image/'));
        if (!files.length) return;

        setUploading(true);
        setError('');

        try {
            const uploaded = await Promise.all(
                files.map((file) => uploadProductImage(file, {
                    target: 'return_photo',
                    productName: request.rmaNumber || request._id,
                }))
            );
            setPhotos((current) => [...current, ...uploaded]);
        } catch (uploadError) {
            setError(uploadError?.message || 'Photo upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const submit = () => {
        setError('');
        setDetails([]);

        submitInspection.mutate(
            {
                id: request._id,
                checklist: visibleItems.map((item) => ({
                    key: item.key,
                    // A reading is still a pass — it is recorded, not judged.
                    // The server decides what the number and the grade mean.
                    result: item.measured || item.graded ? 'pass' : answers[item.key],
                    ...(item.measured ? { value: Number(battery) } : {}),
                    ...(item.graded ? { grade: cosmetic } : {}),
                })),
                photos: photos.map((photo) => ({ url: photo.url, publicId: photo.publicId })),
                ...(findings.trim() ? { findings: findings.trim() } : {}),
            },
            {
                onSuccess: (data) => {
                    toast.success(
                        `Inspection saved — grade ${data.grade}. ${data.suggested?.reason || ''}`,
                        { icon: TOAST_ICONS.statusChanged }
                    );
                    setAnswers({});
                    setBattery('');
                    setCosmetic('');
                    setPhotos([]);
                    setFindings('');
                },
                onError: (mutationError) => {
                    setError(extractApiError(mutationError));
                    setDetails(mutationError?.response?.data?.details || []);
                },
            }
        );
    };

    return (
        <Panel
            title="Inspect the device"
            hint={`Every check answered and at least ${REQUIRED_PHOTOS} photos. This is the record a dispute is answered from months later.`}
            onSubmit={submit}
            submitLabel="Complete inspection"
            busy={submitInspection.isPending}
            disabled={uploading || unanswered > 0 || photos.length < REQUIRED_PHOTOS}
            error={error}
            details={details}
        >
            {/* What the listing said when it sold. The regrade compares
                against this, and a bench without it is guessing at whether
                the device came back worse than it left. */}
            {request.device?.gradeAtSale ? (
                <p className="rounded-xl bg-surface-alt/60 px-3 py-2 text-[11px] font-semibold text-ink-soft">
                    Sold as {request.device.gradeAtSale}
                    {request.device.batteryHealthAtSale != null
                        ? ` · battery ${request.device.batteryHealthAtSale}%`
                        : ''}
                </p>
            ) : null}

            <div className="space-y-1.5">
                {visibleItems.map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-3 rounded-xl bg-surface-alt/60 px-3 py-2">
                        <span className="text-xs text-apple-text">
                            {item.label}
                            {/* The two that decide an outcome on their own, and
                                the one that decides where the device goes. */}
                            {item.critical ? <span className="ml-1 text-brand-red">*</span> : null}
                        </span>

                        {/* The battery reading. Written down because the next
                            buyer needs it and a return can be compared against
                            what it sold at — never a deduction, so the row
                            says so rather than leaving it to be assumed. */}
                        {item.measured ? (
                            <div className="flex w-32 shrink-0 items-center gap-1.5">
                                <Num
                                    step="1"
                                    min="0"
                                    max="100"
                                    value={battery}
                                    onChange={(event) => setBattery(event.target.value)}
                                    aria-label={item.label}
                                />
                                <span className="text-[11px] font-bold text-ink-soft">%</span>
                            </div>
                        ) : null}

                        {/* One of the two axes the final grade is the lower
                            of, and the only one a regrade reads. */}
                        {item.graded ? (
                            <div className="w-36 shrink-0">
                                <Select
                                    value={cosmetic}
                                    onChange={(event) => setCosmetic(event.target.value)}
                                    aria-label={item.label}
                                >
                                    <option value="">Choose…</option>
                                    {grades.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </Select>
                            </div>
                        ) : null}

                        <div className={`flex shrink-0 gap-1 ${item.measured || item.graded ? 'hidden' : ''}`}>
                            {RESULTS.map((result) => (
                                <button
                                    key={result.value}
                                    type="button"
                                    onClick={() => setAnswers((current) => ({ ...current, [item.key]: result.value }))}
                                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors ${
                                        answers[item.key] === result.value
                                            ? result.value === 'fail'
                                                ? 'bg-brand-red text-white'
                                                : 'bg-apple-text text-white'
                                            : 'bg-white text-ink-soft hover:bg-black/[0.04]'
                                    }`}
                                >
                                    {result.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <Field
                label={`Photos (${photos.length}/${REQUIRED_PHOTOS})`}
                hint={checklist?.photoGuidance?.join(' · ')}
            >
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => { addPhotos(event.target.files); event.target.value = ''; }}
                    className="mt-1.5 w-full text-xs text-ink-soft file:mr-3 file:rounded-lg file:border-0 file:bg-apple-text file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
                />
            </Field>

            {photos.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {photos.map((photo, index) => (
                        <div key={photo.publicId} className="relative">
                            <img src={photo.url} alt="" className="h-14 w-14 rounded-lg object-cover" />
                            <button
                                type="button"
                                onClick={() => setPhotos((current) => current.filter((_, i) => i !== index))}
                                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-red text-[10px] font-bold text-white"
                                aria-label="Remove photo"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            ) : null}

            <Field label="What you found" hint="Shown to the customer if the refund is reduced.">
                <Area value={findings} onChange={(event) => setFindings(event.target.value)} />
            </Field>

            {/* Says what is missing rather than leaving a dead button, the same
                way the add-product form does. */}
            {unanswered > 0 || photos.length < REQUIRED_PHOTOS ? (
                <p className="text-xs font-semibold text-ink-soft">
                    Still needed: {[
                        unanswered > 0 && `${unanswered} unanswered check${unanswered === 1 ? '' : 's'}`,
                        photos.length < REQUIRED_PHOTOS && `${REQUIRED_PHOTOS - photos.length} more photo${REQUIRED_PHOTOS - photos.length === 1 ? '' : 's'}`,
                    ].filter(Boolean).join(', ')}
                </p>
            ) : null}
        </Panel>
    );
};

export default InspectionPanel;
