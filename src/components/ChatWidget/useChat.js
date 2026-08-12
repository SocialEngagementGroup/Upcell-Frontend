import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../utilities/axiosInstance';

// Session identity is issued by the server (a signed HttpOnly cookie, or
// the logged-in user via the existing Clerk auth) — see
// Backend/src/middleware/chatSession.middleware.js. This client used to
// mint its own sessionId with Date.now()+Math.random() and send it in the
// body; the server no longer reads that field at all, so nothing here
// needs to generate or store an id. `withCredentials` is required so the
// browser actually sends/accepts that cookie.
export const useChat = () => {
    return useMutation({
        mutationFn: async (message) => {
            const { data } = await axiosInstance.post(
                '/chat',
                { message },
                { withCredentials: true }
            );
            return data;
        },
    });
};
