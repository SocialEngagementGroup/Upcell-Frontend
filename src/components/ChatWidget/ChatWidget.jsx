import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { useChat } from './useChat';

const BOT_AVATAR_SRC = '/staticImages/faviconUpcell.png';

const BotAvatar = () => (
    <img
        src={BOT_AVATAR_SRC}
        alt=""
        className="h-7 w-7 flex-shrink-0 rounded-full bg-white object-contain p-1 ring-1 ring-gray-200"
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

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            {isOpen && (
                <div
                    id="chat-widget-panel"
                    role="dialog"
                    aria-label="Chat with UpCell support"
                    onKeyDown={handleKeyDown}
                    className="mb-3 flex h-[28rem] w-80 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl motion-reduce:transition-none"
                >
                    <div className="flex items-center justify-between border-b border-gray-100 bg-gray-900 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <BotAvatar />
                            <div className="flex flex-col leading-tight">
                                <span className="text-sm font-semibold text-white">UpCell Support</span>
                                <span className="text-xs text-white/60">Typically replies in a few seconds</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={closePanel}
                            aria-label="Close chat"
                            className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                            <CloseRoundedIcon fontSize="small" />
                        </button>
                    </div>

                    <div
                        role="log"
                        aria-live="polite"
                        aria-relevant="additions"
                        className="flex-1 space-y-2 overflow-y-auto px-4 py-3"
                    >
                        {messages.length === 0 && (
                            <div className="flex items-end justify-start gap-2">
                                <BotAvatar />
                                <div className="max-w-[80%] space-y-1 rounded-2xl rounded-bl-sm bg-gray-100 px-3 py-2 text-sm text-gray-900">
                                    <p>Hi! Ask me about our iPhones, iPads, MacBooks, warranty, or shipping.</p>
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
                                    className={`max-w-[80%] space-y-1 rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                                        msg.role === 'user'
                                            ? 'rounded-br-sm bg-gray-900 text-white'
                                            : 'rounded-bl-sm bg-gray-100 text-gray-900'
                                    }`}
                                >
                                    {msg.role === 'assistant' ? renderMessageText(msg.text) : <p>{msg.text}</p>}
                                </div>
                            </div>
                        ))}
                        {isPending && (
                            <div className="flex items-end justify-start gap-2" aria-hidden="true">
                                <BotAvatar />
                                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-gray-100 px-3 py-2.5">
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
                            className="flex-1 rounded-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
                        />
                        <button
                            type="submit"
                            disabled={isPending || !input.trim()}
                            aria-label="Send message"
                            className="rounded-full bg-gray-900 p-2 text-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
                        >
                            <SendRoundedIcon fontSize="small" />
                        </button>
                    </form>
                </div>
            )}

            <button
                ref={toggleButtonRef}
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                aria-controls="chat-widget-panel"
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900 motion-reduce:transition-none"
            >
                {isOpen ? (
                    <CloseRoundedIcon />
                ) : (
                    <img src={BOT_AVATAR_SRC} alt="" className="h-8 w-8 object-contain" />
                )}
            </button>
        </div>
    );
};

export default ChatWidget;
