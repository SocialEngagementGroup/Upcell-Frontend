import React, { useState } from 'react';
import { toast } from 'sonner';
import { TOAST_ICONS } from '../../../utilities/toastIcons';
import { extractApiError } from '../../../utilities/formValidation';
import { useRecordLabelMutation, useShipBackMutation } from '../../../queries/refundRequests';
import { Panel, Field, Text, Num, Select } from './ReturnPanelKit';

const CARRIERS = ['FedEx', 'UPS', 'USPS', 'DHL', 'Other'];

// Attaching a label, in both directions.
//
// The same three fields cover the inbound leg (the customer posting the device
// back) and the outbound one (a rejected device going to them), so this is one
// component with a direction rather than two near-identical forms. The server
// distinguishes them; the person typing does not need to.
const LabelPanel = ({ request, direction = 'inbound' }) => {
    const outbound = direction === 'outbound';

    const [carrier, setCarrier] = useState('FedEx');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [labelUrl, setLabelUrl] = useState('');
    const [labelCost, setLabelCost] = useState('');
    const [error, setError] = useState('');

    const recordLabel = useRecordLabelMutation();
    const shipBack = useShipBackMutation();
    const mutation = outbound ? shipBack : recordLabel;

    const submit = () => {
        setError('');

        mutation.mutate(
            {
                id: request._id,
                carrier,
                trackingNumber: trackingNumber.trim(),
                // Sent only when filled: an empty string is not a URL, and the
                // server would refuse it rather than treat it as absent.
                ...(labelUrl.trim() ? { labelUrl: labelUrl.trim() } : {}),
                ...(labelCost ? { labelCost: Number(labelCost) } : {}),
            },
            {
                onSuccess: () => {
                    toast.success(
                        outbound ? 'Device marked as sent back' : 'Label sent to the customer',
                        { icon: TOAST_ICONS.statusChanged }
                    );
                    setTrackingNumber('');
                    setLabelUrl('');
                    setLabelCost('');
                },
                onError: (mutationError) => setError(extractApiError(mutationError)),
            }
        );
    };

    return (
        <Panel
            title={outbound ? 'Send the device back' : 'Add the return label'}
            hint={outbound
                // Said plainly, because it is the policy staff most often
                // expect to be otherwise.
                ? 'UpCell pays for this leg. Buy the label, then record it here.'
                : 'Buy the label in FedEx Ship Manager, then paste the tracking number and the link. The customer is emailed both.'}
            onSubmit={submit}
            submitLabel={outbound ? 'Record ship-back' : 'Send label to customer'}
            busy={mutation.isPending}
            disabled={!trackingNumber.trim()}
            error={error}
        >
            <Field label="Carrier">
                <Select value={carrier} onChange={(event) => setCarrier(event.target.value)}>
                    {CARRIERS.map((option) => <option key={option} value={option}>{option}</option>)}
                </Select>
            </Field>

            <Field
                label="Tracking number"
                hint="As the carrier shows it. Not the tracking link."
            >
                <Text
                    value={trackingNumber}
                    onChange={(event) => setTrackingNumber(event.target.value)}
                    placeholder="794123456789"
                />
            </Field>

            <Field label="Label link" hint="https link to the PDF. Optional if the customer is posting it themselves.">
                <Text
                    value={labelUrl}
                    onChange={(event) => setLabelUrl(event.target.value)}
                    placeholder="https://…"
                />
            </Field>

            <Field label="Label cost" hint="What it cost, so postage can be reported on.">
                <Num value={labelCost} onChange={(event) => setLabelCost(event.target.value)} placeholder="0.00" />
            </Field>
        </Panel>
    );
};

export default LabelPanel;
