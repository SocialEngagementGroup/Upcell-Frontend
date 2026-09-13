import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import axiosInstance from '../../../../utilities/axiosInstance';
import AdminPageHeader from '../../../../components/AdminPageHeader/AdminPageHeader';
import AdminStatsGrid from '../../../../components/AdminStatsGrid/AdminStatsGrid';
import AdminEmptyState from '../../../../components/AdminState/AdminEmptyState';

// Adding a pallet of stock from a spreadsheet.
//
// The page is built around checking before writing, because that is where
// bulk imports go wrong: 200 rows land, 40 of them are subtly wrong, and
// nobody finds out until a customer orders a phone that is not there. So the
// Check button runs first and is the one the page pushes you towards, and the
// Import button only appears once a check has come back.

const COLUMNS = [
    'modelName',
    'storage',
    'color',
    'price',
    'cosmeticGrade',
    'batteryHealth',
    'carrierStatus',
    'imei',
    'serialNumber',
];

const SAMPLE = [
    COLUMNS.join(','),
    'iPhone 13,128GB,Midnight,499,GOOD,92,Unlocked,123456789012345,',
    'iPhone 13,256GB,Starlight,569,EXCELLENT,100,T-Mobile,123456789012346,',
].join('\n');

// Two megabytes, matching the server. Checked here as well so a 50MB file is
// refused before it is read into memory and posted.
const MAX_BYTES = 2 * 1024 * 1024;

const ImportProducts = () => {
    const [csv, setCsv] = useState('');
    const [fileName, setFileName] = useState('');
    const [report, setReport] = useState(null);
    const [busy, setBusy] = useState(false);
    const fileInput = useRef(null);

    // Cleared whenever the text changes, because a report about the previous
    // paste sitting under a new one is how somebody imports the wrong file.
    const changeCsv = (text, name = '') => {
        setCsv(text);
        setFileName(name);
        setReport(null);
    };

    const pickFile = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_BYTES) {
            toast.error('That file is larger than 2MB.');
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = () => changeCsv(String(reader.result || ''), file.name);
        reader.onerror = () => toast.error('That file could not be read.');
        reader.readAsText(file);
    };

    const send = async (dryRun) => {
        if (!csv.trim()) {
            toast.error('Paste a CSV or choose a file first.');
            return;
        }

        setBusy(true);
        try {
            const res = await axiosInstance.post('admin-products/import', { csv, dryRun });
            setReport(res.data);

            if (dryRun) {
                toast.success(
                    res.data.failed
                        ? `${res.data.wouldImport} rows are ready, ${res.data.failed} need fixing.`
                        : `All ${res.data.wouldImport} rows are ready to import.`
                );
            } else {
                toast.success(`${res.data.imported} units added to the catalogue.`);
                // The file is spent: importing it twice would be refused row by
                // row on the IMEI, but clearing it is what stops anyone trying.
                setCsv('');
                setFileName('');
                if (fileInput.current) fileInput.current.value = '';
            }
        } catch (error) {
            toast.error(error?.response?.data?.error || 'The import could not be run.');
        } finally {
            setBusy(false);
        }
    };

    const checked = Boolean(report);
    const readyToImport = checked && report.dryRun && report.wouldImport > 0;

    const stats = report
        ? [
            { label: 'Rows read', value: report.rows, sub: 'lines under the header' },
            {
                label: report.dryRun ? 'Ready' : 'Imported',
                value: report.dryRun ? report.wouldImport : report.imported,
                sub: report.dryRun ? 'units that would be added' : 'units added to the catalogue',
            },
            { label: 'Need fixing', value: report.failed, sub: 'rows with something wrong' },
        ]
        : [];

    return (
        <section className="space-y-6">
            <AdminPageHeader
                eyebrow="Products"
                title="Import stock."
                description="Add a batch of devices from a spreadsheet. Every row is one physical unit, so check the file first — the check reports exactly what an import would do, and writes nothing."
            />

            {report ? <AdminStatsGrid items={stats} /> : null}

            <div className="admin-panel space-y-5 rounded-[36px] p-6 md:p-8">
                <div>
                    <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Columns</div>
                    <p className="text-sm leading-7 text-ink-soft">
                        <strong>modelName</strong> and <strong>price</strong> are required. The rest are optional:{' '}
                        {COLUMNS.filter((name) => name !== 'modelName' && name !== 'price').join(', ')}. Any other
                        column is ignored.
                    </p>
                    <p className="mt-2 text-sm leading-7 text-ink-soft">
                        A model has to exist already — create it once in Add Product, then import its units here.
                        A device under 80% battery is imported as needing a battery, and will not be listed until
                        that is recorded as done.
                    </p>
                </div>

                <div className="rounded-[28px] bg-surface-alt p-4">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                        <input
                            ref={fileInput}
                            className="admin-input"
                            type="file"
                            accept=".csv,text/csv"
                            onChange={pickFile}
                        />
                        <button
                            className="premium-button-secondary px-5"
                            type="button"
                            onClick={() => changeCsv(SAMPLE, 'example.csv')}
                        >
                            Fill in an example
                        </button>
                        {fileName ? <span className="text-sm text-ink-soft">{fileName}</span> : null}
                    </div>

                    <textarea
                        className="admin-input min-h-[220px] font-mono text-xs"
                        placeholder={SAMPLE}
                        value={csv}
                        onChange={(event) => changeCsv(event.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-3">
                    <button className="premium-button px-6" type="button" disabled={busy} onClick={() => send(true)}>
                        {busy ? 'Working…' : 'Check the file'}
                    </button>

                    {readyToImport ? (
                        <button
                            className="premium-button-secondary px-6"
                            type="button"
                            disabled={busy}
                            onClick={() => send(false)}
                        >
                            Import {report.wouldImport} {report.wouldImport === 1 ? 'unit' : 'units'}
                        </button>
                    ) : null}
                </div>

                {checked && report.dryRun && report.failed > 0 ? (
                    <p className="text-sm leading-7 text-ink-soft">
                        The {report.failed} rows below are skipped. The other {report.wouldImport} can be imported now
                        and the rest fixed and uploaded afterwards, or fix the file first and check it again.
                    </p>
                ) : null}
            </div>

            {checked && report.errors?.length ? (
                <div className="admin-panel rounded-[36px] p-6 md:p-8">
                    <div className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">
                        Rows that need fixing
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[560px] text-left text-sm">
                            <thead>
                                <tr className="text-xs font-bold uppercase tracking-[0.14em] text-apple-gray">
                                    <th className="pb-3 pr-4">Line</th>
                                    <th className="pb-3 pr-4">Model</th>
                                    <th className="pb-3">What is wrong</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.errors.map((row) => (
                                    <tr key={`${row.line}-${row.modelName}`} className="border-t border-black/5 align-top">
                                        <td className="py-3 pr-4 font-medium text-apple-text">{row.line}</td>
                                        <td className="py-3 pr-4 text-ink-soft">{row.modelName || '—'}</td>
                                        <td className="py-3 text-ink-soft">
                                            <ul className="list-disc space-y-1 pl-4">
                                                {row.reasons.map((reason) => (
                                                    <li key={reason}>{reason}</li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : null}

            {checked && !report.errors?.length && !report.dryRun ? (
                <AdminEmptyState
                    title="Import finished."
                    description={`${report.imported} units are in the catalogue. They are listed straight away unless a battery reading put one aside.`}
                />
            ) : null}
        </section>
    );
};

export default ImportProducts;
