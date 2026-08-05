import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import AssignmentReturnRoundedIcon from '@mui/icons-material/AssignmentReturnRounded';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import { useChat } from './useChat';
import quickQuestions from './quickQuestions';

const BOT_AVATAR_SRC = '/staticImages/faviconUpcell.png';
const SUPPORT_EMAIL = 'upcellit@gmail.com';
// e.g. '+1 (614) 555-0123' — set this once a real support line exists.
// The phone chip in the header only renders once this is non-empty, so an
// unfinished/placeholder number never ships visible on the live site.
const SUPPORT_PHONE = '';
const SUPPORT_PHONE_HREF = SUPPORT_PHONE ? `tel:${SUPPORT_PHONE.replace(/[^\d+]/g, '')}` : null;

const QUICK_QUESTION_ICONS = {
    shipping: LocalShippingRoundedIcon,
    returns: AssignmentReturnRoundedIcon,
    'trade-in': SwapHorizRoundedIcon,
    human: SupportAgentRoundedIcon,
};

const CATEGORY_SHORTCUTS = [
    { id: 'iphone', label: 'iPhone', image: '/staticImages/category-iphone.png', to: '/shop?category=iPhone' },
    { id: 'ipad', label: 'iPad', image: '/staticImages/category-ipad.png', to: '/shop?category=iPad' },
    { id: 'macbook', label: 'MacBook', image: '/staticImages/category-macbook.png', to: '/shop?category=MacBook' },
];

const BotAvatar = () => (
    <img
        src={BOT_AVATAR_SRC}
        alt=""
        className="h-9 w-9 flex-shrink-0 rounded-full bg-white object-contain p-1.5 ring-1 ring-gray-200"
    />
);

// Renders **bold** spans within a single line of text.
const formatInlineText = (line) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
    return parts.map((part, index) => (
        part.startsWith('**') && part.endsWith('**')
            ? <strong key={index}>{part.slice(2, -2)}</strong>
            : <span key={index}>{part}</span>
    ));
};

// Turns plain-text/markdown-lite replies (paragraphs, "- " / "1. " lists, **bold**)
// into real chat-message markup instead of one raw text blob.
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

    const toggleButtonRef = useRef(null);
    const inputRef = useRef(null);
    const messagesEndRef = useRef(null);

    const { mutateAsync, isPending } = useChat();

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isPending]);

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
                    <div className="border-b-2 border-brand-red bg-[linear-gradient(160deg,#1c1c1e_0%,#2c2c2e_100%)] px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BotAvatar />
                                <div className="flex flex-col leading-tight">
                                    <span className="text-base font-bold text-white">UpCell Support</span>
                                    <span className="flex items-center gap-1.5 text-xs font-normal text-white/60">
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-75 motion-reduce:hidden" />
                                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-red" />
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
                    </div>

                    <div
                        role="log"
                        aria-live="polite"
                        aria-relevant="additions"
                        className="chat-scrollbar flex-1 space-y-3 overflow-y-auto bg-[linear-gradient(180deg,#fbfbfc_0%,#f2f2f4_100%)] px-4 py-3"
                    >
                        {messages.length === 0 && (
                            <div className="space-y-3">
                                <div className="flex items-end justify-start gap-2">
                                    <BotAvatar />
                                    <div className="max-w-[80%] space-y-1 rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-[15px] text-gray-900 shadow-sm">
                                        <p className="font-normal">Hi! Ask me anything, or tap a quick question below to get started.</p>
                                    </div>
                                </div>
                                <div className="pl-11">
                                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-gray-400">Browse by category</p>
                                    <div className="chat-scrollbar flex gap-2 overflow-x-auto pb-1">
                                        {CATEGORY_SHORTCUTS.map((cat) => (
                                            <Link
                                                key={cat.id}
                                                to={cat.to}
                                                onClick={closePanel}
                                                className="group w-20 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-brand-red/40 hover:shadow-sm"
                                            >
                                                <div className="aspect-square w-full overflow-hidden bg-gray-50">
                                                    <img
                                                        src={cat.image}
                                                        alt={cat.label}
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                </div>
                                                <p className="px-1 py-1 text-center text-[11px] font-semibold text-gray-700 group-hover:text-brand-red">
                                                    {cat.label}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.role === 'assistant' && <BotAvatar />}
                                <div
                                    className={`max-w-[80%] space-y-1 rounded-2xl px-3 py-2 text-[15px] font-normal leading-relaxed ${
                                        msg.role === 'user'
                                            ? 'rounded-br-sm bg-gray-900 text-white'
                                            : 'rounded-bl-sm bg-white text-gray-900 shadow-sm'
                                    }`}
                                >
                                    {msg.role === 'assistant' ? renderMessageText(msg.text) : <p>{msg.text}</p>}
                                </div>
                            </div>
                        ))}
                        {isPending && (
                            <div className="flex items-end justify-start gap-2" aria-hidden="true">
                                <BotAvatar />
                                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white px-3 py-2.5 shadow-sm">
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
                                </div>
                            </div>
                        )}
                        {escalate && (
                            <p className="text-sm text-gray-600">
                                Need a person?{' '}
                                <Link to="/support" className="underline" onClick={closePanel}>
                                    Contact our support team
                                </Link>.
                            </p>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-scrollbar flex gap-1.5 overflow-x-auto border-t border-gray-100 px-3 py-2">
                        {quickQuestions.map((item) => {
                            const Icon = QUICK_QUESTION_ICONS[item.id];
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleQuickQuestion(item)}
                                    disabled={isPending}
                                    className="group flex flex-shrink-0 items-center gap-1 rounded-full border border-gray-300 bg-white px-2.5 py-1 text-[13px] font-semibold text-gray-800 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white disabled:opacity-40"
                                >
                                    {Icon && <Icon className="!text-lg text-brand-red group-hover:text-white" />}
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>

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
