import { Link } from 'react-router-dom';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

// The promo rail down the left of the panel. It answers the questions that
// stop a refurb purchase — what happens to my old device, when does it arrive,
// what if it is wrong — next to the products rather than three clicks away.
const MegaMenuAside = ({ aside }) => {
    if (!aside) return null;

    return (
        <aside className="w-[200px] shrink-0 rounded-2xl bg-surface-alt p-5 lg:w-[220px]">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-apple-gray">
                {aside.heading}
            </h2>

            <ul className="mt-4 space-y-1">
                {aside.items.map((item) => (
                    <li key={item.to}>
                        <Link
                            to={item.to}
                            className="group -mx-2 block rounded-xl px-2 py-2 outline-none transition-colors duration-200 ease-smooth hover:bg-white focus-visible:ring-2 focus-visible:ring-brand-red"
                        >
                            <span className="flex items-center gap-1 text-[13px] font-bold text-apple-text">
                                {item.title}
                                <ChevronRightRoundedIcon
                                    aria-hidden="true"
                                    className="!text-[16px] text-apple-gray transition-transform duration-200 ease-smooth group-hover:translate-x-0.5 group-hover:text-brand-red"
                                />
                            </span>
                            <span className="mt-0.5 block text-[12px] font-normal leading-snug text-apple-gray">
                                {item.copy}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default MegaMenuAside;
