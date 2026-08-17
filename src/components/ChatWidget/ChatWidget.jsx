import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import AssignmentReturnRoundedIcon from '@mui/icons-material/AssignmentReturnRounded';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { useChat } from './useChat';
import { productsInReply, stripPaths } from './replyProducts';
import { useAutoCarousel } from './useAutoCarousel';
import quickQuestions from './quickQuestions';
import { useProductsQuery } from '../../queries/products';
import { getProductRouteParent, groupProductsByParent } from '../../utilities/catalog';

const MAX_LATEST_IPHONES = 12;

const BOT_AVATAR_SRC = '/staticImages/faviconUpcell.png';
const SUPPORT_EMAIL = 'upcellit@gmail.com';
const SUPPORT_PHONE = '+1 (380) 266-3942';
const SUPPORT_PHONE_HREF = SUPPORT_PHONE ? `tel:${SUPPORT_PHONE.replace(/[^\d+]/g, '')}` : null;

const QUICK_QUESTION_ICONS = {
    shipping: LocalShippingRoundedIcon,
    returns: AssignmentReturnRoundedIcon,
    'trade-in': SwapHorizRoundedIcon,
    human: SupportAgentRoundedIcon,
};

const BotAvatar = () => (
    <img
        src={BOT_AVATAR_SRC}
        alt=""
        className="h-10 w-10 flex-shrink-0 rounded-full border border-gray-200 bg-black object-contain p-1.5"
    />
);

// Inverted counterpart to BotAvatar — light circle instead of black, dark
// icon instead of the logo, same tiny border, same size. A literal color
// invert of the logo image itself would flip brand-red into an off-brand
// cyan, so "inverted" is expressed as a light/dark swap of the same treatment.
const UserAvatar = () => (
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 bg-apple-bg">
        <PersonRoundedIcon className="!text-xl text-apple-text" />
    </div>
);

// The assistant answers product, trade-in and policy questions by pointing at a
// page ("...on the Shop page at /shop"), so those paths are worth being
// clickable. SEG F-08: this is an allowlist of exact internal routes, never an
// href taken from model output — the model can only select from this map, so a
// reply cannot introduce a destination, an external host, or a javascript: URL.
const LINKABLE_PATHS = {
    '/shop': 'Shop',
    '/trade-in': 'Trade-in',
    '/support': 'Support',
    '/return-policy': 'Return Policy',
    '/delivery-policy': 'Delivery Policy',
    '/privacy-policy': 'Privacy Policy',
    '/terms-conditions': 'Terms & Conditions',
    '/blogs': 'Blog',
    '/cart': 'Cart',
    '/about': 'About',
};
// Captures a whole path-shaped token, then membership in LINKABLE_PATHS decides
// whether it becomes a link. Matching the full token rather than a prefix is
// what keeps "/shopping-cart" from being rendered as a link to /shop followed by
// stray text.
// Product pages are the one dynamic route the assistant may link to. The shape
// is fixed — /iphone/<24-hex parent>/<24-hex variation>, exactly what
// ModernProductCard builds — so it can be validated rather than allowlisted,
// and nothing else about the URL is under the model's control.
const PRODUCT_PATH_PATTERN = /^\/iphone\/[a-f\d]{24}\/[a-f\d]{24}$/i;
const PATH_TOKEN_PATTERN = /(\/iphone\/[a-f\d]{24}\/[a-f\d]{24}|\/[a-z][a-z-]*)/gi;
const isLinkablePath = (segment) => (
    Object.prototype.hasOwnProperty.call(LINKABLE_PATHS, segment) || PRODUCT_PATH_PATTERN.test(segment)
);

// The prompt asks for bare paths, but models reach for markdown links anyway,
// and a raw "[Shop page](/shop)" in a chat bubble looks broken. This unwraps
// them to the link text plus the path, which the allowlist below then handles —
// the href is still ours, never the one the model wrote.
const MARKDOWN_LINK_PATTERN = /\[([^\]\n]+)\]\((https?:\/\/[^\s)]*?)?(\/iphone\/[a-f\d]{24}\/[a-f\d]{24}|\/[a-z][a-z-]*)?[^\s)]*\)/gi;
const unwrapMarkdownLinks = (line) => line.replace(
    MARKDOWN_LINK_PATTERN,
    (match, label, _origin, path) => (path ? `${label} (${path})` : label)
);

// A product the assistant just mentioned, shown as something buyable rather
// than a sentence about a thing. Price comes from the same product record the
// Shop page renders, so the card and the shop can never disagree.
const ChatProductCard = ({ product, onNavigate }) => (
    <Link
        to={`/iphone/${getProductRouteParent(product)}/${product._id}`}
        onClick={onNavigate}
        draggable={false}
        className="group flex w-40 flex-shrink-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:border-brand-red/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
    >
        <div className="aspect-square w-full bg-gray-50">
            <img
                src={product.image}
                alt={product.productName}
                draggable={false}
                loading="lazy"
                className="pointer-events-none h-full w-full select-none object-contain p-2"
            />
        </div>
        <div className="flex flex-1 flex-col gap-0.5 px-2.5 pb-2.5 pt-2">
            <p className="truncate text-[12px] font-semibold leading-tight text-gray-900">{product.productName}</p>
            <p className="text-[11px] leading-tight text-gray-500">
                {[product.storage, product.condition].filter(Boolean).join(' · ')}
            </p>
            <p className="mt-1 text-[13px] font-bold text-brand-red">
                {String(product.price).startsWith('$') ? product.price : `$${product.price}`}
            </p>
            <span className="mt-1.5 rounded-lg bg-gray-900 px-2 py-1 text-center text-[11px] font-semibold text-white transition group-hover:bg-brand-red">
                View product
            </span>
        </div>
    </Link>
);

// Renders **bold** spans and allowlisted internal links within a single line.
const formatInlineText = (rawLine) => {
    const line = unwrapMarkdownLinks(rawLine);
    const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        const segments = part.split(PATH_TOKEN_PATTERN).filter(Boolean);
        // A path only counts when it starts a word — otherwise the tail of a URL
        // like "https://example.test/shop" would render as a link to our own
        // /shop, which is misleading even though the destination is still ours.
        const startsWord = (segmentIndex) => (
            segmentIndex === 0 || /[\s([]$/.test(segments[segmentIndex - 1])
        );
        return (
            <span key={index}>
                {segments.map((segment, segmentIndex) => (
                    isLinkablePath(segment) && startsWord(segmentIndex)
                        ? (
                            <Link
                                key={segmentIndex}
                                to={segment}
                                className="font-semibold text-brand-red underline underline-offset-2"
                            >
                                {/* A raw product path is 50 characters of hex — show the
                                    page's name instead, and keep the destination intact. */}
                                {LINKABLE_PATHS[segment] ? segment : 'View product'}
                            </Link>
                        )
                        : <span key={segmentIndex}>{segment}</span>
                ))}
            </span>
        );
    });
};

// Turns plain-text/markdown-lite replies (paragraphs, "- " / "1. " lists, **bold**)
// into real chat-message markup instead of one raw text blob.
//
// SEG F-08: this only ever builds React elements (<p>/<ul>/<li>/<strong>) from
// parsed substrings — never dangerouslySetInnerHTML, never a raw HTML string,
// never an arbitrary href/src pulled from model output. That's what keeps
// model-authored text from becoming a rendering surface. If markdown ever
// needs to support links or images, route them through an explicit allowlist
// instead of just extending this parser — see F-08 in the SEG doc.
const renderMessageText = (text) => {
    const lines = text.split('\n');
    const blocks = [];
    let currentList = null;

    lines.forEach((rawLine) => {
        const line = rawLine.trim();
        const bulletMatch = line.match(/^[-*]\s+(.*)/);
        const numberedMatch = line.match(/^\d+[.)]\s+(.*)/);

        if (bulletMatch) {
            if (!currentList || currentList.type !== 'ul') {
                currentList = { type: 'ul', items: [] };
                blocks.push(currentList);
            }
            currentList.items.push(bulletMatch[1]);
            return;
        }

        if (numberedMatch) {
            if (!currentList || currentList.type !== 'ol') {
                currentList = { type: 'ol', items: [] };
                blocks.push(currentList);
            }
            currentList.items.push(numberedMatch[1]);
            return;
        }

        currentList = null;
        if (line) {
            blocks.push({ type: 'p', text: line });
        }
    });

    return blocks.map((block, index) => {
        if (block.type === 'ul') {
            return (
                <ul key={index} className="list-disc space-y-0.5 pl-4">
                    {block.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{formatInlineText(item)}</li>
                    ))}
                </ul>
            );
        }
        if (block.type === 'ol') {
            return (
                <ol key={index} className="list-decimal space-y-0.5 pl-4">
                    {block.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{formatInlineText(item)}</li>
                    ))}
                </ol>
            );
        }
        return <p key={index}>{formatInlineText(block.text)}</p>;
    });
};

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [escalate, setEscalate] = useState(false);
    // Issued by the server alongside an escalation and posted to the support
    // space at the same moment, so the customer can open with "I'm UP-4F2A1"
    // and the person already knows the conversation.
    const [reference, setReference] = useState(null);

    const toggleButtonRef = useRef(null);
    const inputRef = useRef(null);
    const messagesEndRef = useRef(null);

    const { mutateAsync, isPending } = useChat();

    // Reuses the site's existing shared /product query (already depended on
    // by ShopPage, ProductDetailPage, etc. — see catalog.js) rather than
    // adding a new endpoint. Only fetches while the widget is actually open.
    const { data: allProducts = [] } = useProductsQuery({ enabled: isOpen });

    // One flat list, latest model first — each product is its own slide.
    const latestIphones = useMemo(() => {
        const iphones = groupProductsByParent(allProducts.filter((product) => product.family === 'iPhone'));
        const withRank = iphones.map((product) => {
            const match = product.productName?.match(/\d+/);
            return { ...product, _generationRank: match ? parseInt(match[0], 10) : 0 };
        });
        withRank.sort((a, b) => b._generationRank - a._generationRank);
        return withRank.slice(0, MAX_LATEST_IPHONES);
    }, [allProducts]);

    // Lets a reply's product paths be turned into cards without another fetch —
    // this is the same list the carousel above already uses.
    const productsById = useMemo(() => {
        const index = new Map();
        for (const product of allProducts) index.set(product._id, product);
        return index;
    }, [allProducts]);

    const showEmptyState = isOpen && messages.length === 0;

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isPending]);

    const iphoneCarousel = useAutoCarousel({ active: showEmptyState && latestIphones.length > 0 });

    const closePanel = () => {
        setIsOpen(false);
        toggleButtonRef.current?.focus();
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            closePanel();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || isPending) return;

        setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
        setInput('');

        try {
            const data = await mutateAsync(trimmed);
            setMessages((prev) => [...prev, { role: 'assistant', text: data.reply }]);
            setEscalate(Boolean(data.escalate));
            setReference(data.reference || null);
        } catch (error) {
            setMessages((prev) => [...prev, {
                role: 'assistant',
                text: "Sorry, I'm having trouble responding right now. Please try again in a moment.",
            }]);
        }
    };

    // Answered instantly on the client, no AI call — restarts the conversation
    // with just this question so the reply stays short and specific.
    const handleQuickQuestion = (item) => {
        setMessages([
            { role: 'user', text: item.question },
            { role: 'assistant', text: item.answer },
        ]);
        setEscalate(Boolean(item.escalate));
        // A canned answer never went through the server, so there is no
        // reference and nobody has been notified.
        setReference(null);
        setInput('');
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            {isOpen && (
                <div
                    id="chat-widget-panel"
                    role="dialog"
                    aria-label="Chat with UpCell support"
                    onKeyDown={handleKeyDown}
                    className="mb-3 flex h-[calc(100vh-7rem)] max-h-[42rem] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl motion-reduce:transition-none sm:h-[39rem] sm:w-[26rem]"
                >
                    <div className="relative overflow-hidden border-b-2 border-brand-red p-5 shadow-md">
                        <div className="absolute inset-0 bg-[#141416]">
                            <img
                                src="/product-images/product-photos/iphone-17-iphone-17-pro-max-17-pro-max-deep-blue-2dca7e0552.png"
                                alt=""
                                aria-hidden="true"
                                className="pointer-events-none absolute -right-8 -top-6 h-[160%] w-auto rotate-6 select-none object-contain opacity-90"
                            />
                            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,20,22,0.88)_0%,rgba(20,20,22,0.6)_35%,rgba(20,20,22,0)_65%)]" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <BotAvatar />
                                    <div className="flex flex-col leading-tight">
                                        <span className="text-lg font-bold text-white">UpCell Support</span>
                                        <span className="flex items-center gap-1.5 text-sm font-normal text-white/70">
                                            <span className="relative flex h-2 w-2">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-75 motion-reduce:hidden" />
                                                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-red" />
                                            </span>
                                            Typically replies in a few seconds
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={closePanel}
                                    aria-label="Close chat"
                                    className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                >
                                    <CloseRoundedIcon fontSize="medium" />
                                </button>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                                <a
                                    href={`mailto:${SUPPORT_EMAIL}`}
                                    className="flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1.5 text-[13px] font-medium text-white/90 transition hover:bg-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                >
                                    <MailOutlineRoundedIcon className="!text-base" />
                                    {SUPPORT_EMAIL}
                                </a>
                                {SUPPORT_PHONE_HREF && (
                                    <a
                                        href={SUPPORT_PHONE_HREF}
                                        className="flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1.5 text-[13px] font-medium text-white/90 transition hover:bg-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                    >
                                        <LocalPhoneRoundedIcon className="!text-base" />
                                        {SUPPORT_PHONE}
                                    </a>
                                )}
                            </div>
                            {/* SEG F-12 / EU AI Act Article 50: visible before the first
                                message is ever sent, not buried in a terms page. */}
                            <p className="mt-2 text-[11px] text-white/60">
                                You&apos;re chatting with an AI assistant, not a human.
                            </p>
                        </div>
                    </div>

                    <div
                        role="log"
                        aria-live="polite"
                        aria-relevant="additions"
                        className="no-scrollbar flex-1 space-y-3 overflow-y-auto bg-[linear-gradient(180deg,#fbfbfc_0%,#f2f2f4_100%)] px-4 py-3"
                    >
                        {latestIphones.length > 0 && (
                            <div
                                ref={iphoneCarousel.trackRef}
                                className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth active:cursor-grabbing"
                                style={{ cursor: 'grab' }}
                                {...iphoneCarousel.trackHandlers}
                            >
                                {latestIphones.map((product) => (
                                    <Link
                                        key={product._id}
                                        to={`/iphone/${getProductRouteParent(product)}/${product._id}`}
                                        onClick={iphoneCarousel.handleLinkClick(closePanel)}
                                        draggable={false}
                                        className="group block w-1/4 flex-shrink-0 snap-start px-1"
                                    >
                                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition hover:border-brand-red/40 hover:shadow-lg">
                                            <div className="aspect-square w-full overflow-hidden bg-gray-50">
                                                <img
                                                    src={product.image}
                                                    alt={product.productName}
                                                    draggable={false}
                                                    className="pointer-events-none h-full w-full select-none object-contain p-1.5"
                                                />
                                            </div>
                                            <div className="px-1.5 py-1.5 text-center">
                                                <p className="truncate text-[10px] font-semibold text-gray-900">{product.productName}</p>
                                                <p className="text-[10px] font-bold text-brand-red">
                                                    {String(product.price).startsWith('$') ? product.price : `$${product.price}`}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                        {messages.length === 0 && (
                            <div className="flex items-end justify-start gap-2">
                                <BotAvatar />
                                <div className="max-w-[80%] space-y-1 rounded-2xl rounded-bl-sm bg-surface px-3 py-2 text-[15px] text-apple-text shadow-md">
                                    <p className="font-normal">Hi! Ask me anything, or tap a quick question below to get started.</p>
                                </div>
                            </div>
                        )}
                        {messages.map((msg, index) => {
                        const cards = msg.role === 'assistant' ? productsInReply(msg.text, productsById) : [];
                        const bodyText = cards.length > 0
                            ? stripPaths(msg.text, cards.map((card) => card.path))
                            : msg.text;

                        return (
                            <div key={index} className="space-y-2">
                            <div
                                className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.role === 'assistant' && <BotAvatar />}
                                <div
                                    className={`max-w-[80%] space-y-1 rounded-2xl px-3 py-2 text-[15px] font-normal leading-relaxed shadow-md ${
                                        msg.role === 'user'
                                            ? 'rounded-br-sm bg-ink-soft text-apple-bg'
                                            : 'rounded-bl-sm bg-surface text-apple-text'
                                    }`}
                                >
                                    {msg.role === 'assistant' ? renderMessageText(bodyText) : <p>{msg.text}</p>}
                                </div>
                                {msg.role === 'user' && <UserAvatar />}
                            </div>

                            {cards.length > 0 && (
                                <div className="no-scrollbar flex gap-2 overflow-x-auto pl-12 pr-1 pb-1">
                                    {cards.map(({ product }) => (
                                        <ChatProductCard
                                            key={product._id}
                                            product={product}
                                            onNavigate={closePanel}
                                        />
                                    ))}
                                </div>
                            )}
                            </div>
                        );
                        })}
                        {isPending && (
                            <div className="flex items-end justify-start gap-2" aria-hidden="true">
                                <BotAvatar />
                                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white px-3 py-2.5 shadow-md">
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
                                </div>
                            </div>
                        )}
                        {/* The handoff. Three real routes rather than one link
                            buried in a sentence — this appears at the moment a
                            customer is most likely to give up. */}
                        {escalate && (
                            <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                                <p className="text-[13px] font-semibold text-gray-900">Talk to a person</p>
                                <p className="mt-0.5 text-[12px] text-gray-500">
                                    {reference
                                        ? 'Our team has been notified. Quote this reference and they will already have your question.'
                                        : 'Our team can pick this up from here.'}
                                </p>
                                {reference && (
                                    <p className="mt-1.5 inline-block rounded-md bg-gray-900 px-2 py-1 font-mono text-[12px] font-semibold tracking-wider text-white">
                                        {reference}
                                    </p>
                                )}
                                <div className="mt-2.5 flex flex-wrap gap-1.5">
                                    {SUPPORT_PHONE_HREF && (
                                        <a
                                            href={SUPPORT_PHONE_HREF}
                                            className="flex items-center gap-1 rounded-lg border border-gray-300 px-2.5 py-1.5 text-[12px] font-semibold text-gray-800 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                                        >
                                            <LocalPhoneRoundedIcon className="!text-[15px]" />
                                            Call
                                        </a>
                                    )}
                                    <a
                                        href={`mailto:${SUPPORT_EMAIL}${reference ? `?subject=Chat%20${reference}` : ''}`}
                                        className="flex items-center gap-1 rounded-lg border border-gray-300 px-2.5 py-1.5 text-[12px] font-semibold text-gray-800 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                                    >
                                        <MailOutlineRoundedIcon className="!text-[15px]" />
                                        Email
                                    </a>
                                    <Link
                                        to="/support"
                                        onClick={closePanel}
                                        className="flex items-center gap-1 rounded-lg border border-gray-300 px-2.5 py-1.5 text-[12px] font-semibold text-gray-800 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                                    >
                                        <SupportAgentRoundedIcon className="!text-[15px]" />
                                        Support page
                                    </Link>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {messages.length === 0 && (
                        <div className="grid grid-cols-2 gap-1.5 border-t border-gray-100 px-3 py-2">
                            {quickQuestions.map((item) => {
                                const Icon = QUICK_QUESTION_ICONS[item.id];
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => handleQuickQuestion(item)}
                                        disabled={isPending}
                                        className="group flex items-center justify-center gap-1 rounded-xl border-2 border-gray-600 bg-white px-2.5 py-2 text-[13px] font-semibold text-gray-800 shadow-sm transition hover:border-gray-900 hover:bg-gray-900 hover:text-white disabled:opacity-40"
                                    >
                                        {Icon && <Icon className="!text-lg text-brand-red group-hover:text-white" />}
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-gray-100 px-3 py-2">
                        <label htmlFor="chat-widget-input" className="sr-only">Type your message</label>
                        <input
                            id="chat-widget-input"
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            placeholder="Type a message…"
                            autoComplete="off"
                            // Matches the server's chatMessageSchema limit, so a long
                            // message is stopped while typing instead of failing on send.
                            maxLength={1000}
                            className="flex-1 rounded-full border border-gray-200 px-3.5 py-2.5 text-[15px] font-normal focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
                        />
                        <button
                            type="submit"
                            disabled={isPending || !input.trim()}
                            aria-label="Send message"
                            className="rounded-full bg-gray-900 p-2.5 text-white transition hover:bg-gray-800 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
                        >
                            <SendRoundedIcon fontSize="medium" />
                        </button>
                    </form>
                </div>
            )}

            <div className="flex items-center gap-2">
                {!isOpen && (
                    <span className="hidden rounded-full bg-white px-3.5 py-2.5 text-[15px] font-bold text-gray-900 shadow-lg sm:inline-block">
                        Chat with us
                    </span>
                )}
                <button
                    ref={toggleButtonRef}
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-expanded={isOpen}
                    aria-controls="chat-widget-panel"
                    aria-label={isOpen ? 'Close chat' : 'Open chat'}
                    className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-red motion-reduce:transition-none"
                >
                    {isOpen ? (
                        <CloseRoundedIcon fontSize="large" />
                    ) : (
                        <>
                            <img src={BOT_AVATAR_SRC} alt="" className="h-10 w-10 object-contain" />
                            <span className="absolute right-0 top-0 flex h-4 w-4" aria-hidden="true">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-75 motion-reduce:hidden" />
                                <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-brand-red" />
                            </span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ChatWidget;
