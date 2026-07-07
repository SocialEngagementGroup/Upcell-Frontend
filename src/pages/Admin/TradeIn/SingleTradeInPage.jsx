import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosInstance from '../../../utilities/axiosInstance';
import { toast } from 'react-toastify';
import SingleTradeInRequest from './SingleTradeInRequest';
import AdminPageHeader from '../../../components/AdminPageHeader/AdminPageHeader';
import AdminLoadingState from '../../../components/AdminState/AdminLoadingState';
import AdminEmptyState from '../../../components/AdminState/AdminEmptyState';

const SingleTradeInPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRequest = async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get(`admin-trade-in-requests/byRequestId:${id}`);
            setRequest(res.data.items?.[0] || null);
        } catch (error) {
            console.log(error);
            toast.error('Failed to load trade-in request');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequest();
    }, [id]);

    if (isLoading) {
        return <AdminLoadingState title="Loading trade-in request" description="Fetching request details." />;
    }

    if (!request) {
        return (
            <AdminEmptyState
                title="Trade-in request not found."
                description="It may have been deleted or the link is out of date."
            />
        );
    }

    return (
        <section className="space-y-6">
            <AdminPageHeader
                eyebrow="Trade In"
                title="Trade-in request details."
                description="Review this request and move it through the quote flow."
            >
                <Link to="/admin-secret/trade-in" className="premium-button-secondary inline-flex px-5">
                    Back to all trade-ins
                </Link>
            </AdminPageHeader>

            <SingleTradeInRequest
                request={request}
                onStatusUpdated={(updated) => setRequest(updated)}
                onDeleted={() => navigate('/admin-secret/trade-in')}
            />
        </section>
    );
};

export default SingleTradeInPage;
