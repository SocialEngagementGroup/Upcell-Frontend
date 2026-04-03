import { useEffect, useRef } from 'react';
import { trackAnalyticsEvent } from './analytics';

const useFormAnalytics = (formName) => {
    const hasStartedRef = useRef(false);
    const hasCompletedRef = useRef(false);

    const markInteraction = () => {
        if (hasStartedRef.current) return;
        hasStartedRef.current = true;
        trackAnalyticsEvent({
            category: 'form_engagement',
            name: 'form_started',
            status: 'started',
            formName,
        }, { keepalive: true });
    };

    const trackSuccess = (metadata = {}) => {
        hasCompletedRef.current = true;
        trackAnalyticsEvent({
            category: 'form_submit',
            name: 'form_submit_success',
            status: 'success',
            formName,
            metadata,
        }, { keepalive: true });
    };

    const trackFailure = (message, metadata = {}) => {
        markInteraction();
        trackAnalyticsEvent({
            category: 'form_submit',
            name: 'form_submit_failed',
            status: 'failed',
            formName,
            message,
            metadata,
        }, { keepalive: true });
    };

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (!hasStartedRef.current || hasCompletedRef.current) return;

            trackAnalyticsEvent({
                category: 'form_dropoff',
                name: 'form_abandoned',
                status: 'dropoff',
                formName,
            }, { beacon: true });
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);

            if (!hasStartedRef.current || hasCompletedRef.current) return;

            trackAnalyticsEvent({
                category: 'form_dropoff',
                name: 'form_abandoned',
                status: 'dropoff',
                formName,
            }, { beacon: true });
        };
    }, [formName]);

    return { markInteraction, trackSuccess, trackFailure };
};

export default useFormAnalytics;
