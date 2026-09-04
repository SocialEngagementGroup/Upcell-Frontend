import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../utilities/axiosInstance';
import { notificationKeys } from './keys';

// The sidebar badge and the Notifications page each used to poll
// admin-notifications-unread-count independently, with no shared cache — one
// extra network call per page, and marking a notification read on one never
// updated the other until a full reload. staleTime keeps repeat mounts from
// refetching immediately; refetchInterval keeps the badge from ever going
// stale for long while an admin is actually in the dashboard.
export const useUnreadNotificationsCountQuery = (options = {}) => useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => axiosInstance.get('admin-notifications-unread-count').then((res) => res.data.count || 0),
    staleTime: 30_000,
    refetchInterval: 60_000,
    ...options,
});

export const useMarkNotificationReadMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => axiosInstance.patch(`admin-notifications/${id}/read`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
        },
    });
};
