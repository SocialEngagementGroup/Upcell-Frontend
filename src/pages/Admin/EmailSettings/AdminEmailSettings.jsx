import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utilities/axiosInstance';
import { toast } from 'react-toastify';
import AdminPageHeader from '../../../components/AdminPageHeader/AdminPageHeader';
import AdminLoadingState from '../../../components/AdminState/AdminLoadingState';

const ToggleSwitch = ({ checked, onChange, disabled, label, description }) => (
    <div className="flex items-center justify-between gap-4 rounded-[28px] bg-surface-alt p-5">
        <div>
            <p className="text-sm font-bold text-apple-text">{label}</p>
            {description ? <p className="mt-1 text-sm text-ink-soft">{description}</p> : null}
        </div>
        <button
            type="button"
            className={`inline-flex items-center rounded-full px-1.5 py-1.5 transition-all ${
                checked ? 'bg-emerald-50 hover:bg-emerald-100' : 'bg-red-50 hover:bg-red-100'
            } ${disabled ? 'opacity-70' : ''}`}
            onClick={() => onChange(!checked)}
            disabled={disabled}
            title={checked ? 'Turn off' : 'Turn on'}
        >
            <span className={`relative block h-6 w-11 rounded-full transition-colors ${checked ? 'bg-emerald-200' : 'bg-red-200'}`}>
                <span
                    className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow-sm transition-all ${
                        checked ? 'left-6' : 'left-1'
                    }`}
                />
            </span>
        </button>
    </div>
);

const AdminEmailSettings = () => {
    const [config, setConfig] = useState(null);
    const [tradeInAdminEmail, setTradeInAdminEmail] = useState('');
    const [enableCustomerEmails, setEnableCustomerEmails] = useState(true);
    const [enableAdminEmails, setEnableAdminEmails] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchConfig = async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get('admin-email-config');
            setConfig(res.data);
            setTradeInAdminEmail(res.data.tradeInAdminEmail || '');
            setEnableCustomerEmails(Boolean(res.data.enableCustomerEmails));
            setEnableAdminEmails(Boolean(res.data.enableAdminEmails));
        } catch (error) {
            console.log(error);
            toast.error('Failed to load email settings');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const handleSave = async (event) => {
        event.preventDefault();
        setIsSaving(true);
        try {
            const res = await axiosInstance.patch('admin-email-config', {
                tradeInAdminEmail,
                enableCustomerEmails,
                enableAdminEmails,
            });
            setConfig(res.data);
            toast.success('Email settings saved');
        } catch (error) {
            console.log(error);
            toast.error('Failed to save email settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <AdminLoadingState title="Loading email settings" description="Fetching the current configuration." />;
    }

    return (
        <section className="space-y-6">
            <AdminPageHeader
                eyebrow="Email Settings"
                title="Control trade-in email notifications."
                description="Change who gets notified and turn customer or admin emails on and off — no code changes needed."
            />

            <form className="admin-panel space-y-6 rounded-[36px] p-6 md:p-8" onSubmit={handleSave}>
                <div>
                    <label className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">
                        Admin notification email
                    </label>
                    <input
                        className="admin-input"
                        type="email"
                        value={tradeInAdminEmail}
                        onChange={(e) => setTradeInAdminEmail(e.target.value)}
                        placeholder="admin@upcellit.com"
                        required
                    />
                </div>

                <ToggleSwitch
                    checked={enableCustomerEmails}
                    onChange={setEnableCustomerEmails}
                    disabled={isSaving}
                    label="Customer emails"
                    description="Send confirmation and status-update emails to the customer."
                />

                <ToggleSwitch
                    checked={enableAdminEmails}
                    onChange={setEnableAdminEmails}
                    disabled={isSaving}
                    label="Admin emails"
                    description="Send a notification to the admin email above when a new trade-in request comes in."
                />

                <div className="rounded-[28px] bg-surface-alt p-5">
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Total emails sent</div>
                    <div className="mt-2 text-[28px] font-extrabold text-apple-text">{config?.sentCount ?? 0}</div>
                </div>

                <button className="premium-button" type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save settings'}
                </button>
            </form>
        </section>
    );
};

export default AdminEmailSettings;
