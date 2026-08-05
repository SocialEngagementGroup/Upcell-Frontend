import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../utilities/axiosInstance';

const CHAT_SESSION_STORAGE_KEY = 'upcell_chat_session_id';

const getChatSessionId = () => {
    const existingId = window.sessionStorage.getItem(CHAT_SESSION_STORAGE_KEY);
    if (existingId) return existingId;

    const nextId = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    window.sessionStorage.setItem(CHAT_SESSION_STORAGE_KEY, nextId);
    return nextId;
};

export const useChat = () => {
    return useMutation({
        mutationFn: async (message) => {
            const { data } = await axiosInstance.post('/chat', {
                message,
                sessionId: getChatSessionId(),
            });
            return data;
        },
    });
};
