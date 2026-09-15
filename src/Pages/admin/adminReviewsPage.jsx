import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/api";
import LoadingAnimation from "../../components/loadingAnimation";

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    async function updateVisibility(review) {
        try {
            const response = await api.put(`/reviews/${review._id}/visibility`, {
                isPublished: !review.isPublished,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setReviews((currentReviews) => currentReviews.map((item) => item._id === review._id ? response.data.review : item));
            toast.success(review.isPublished ? "Review hidden" : "Review published");
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not update review");
        }
    }

    async function deleteReview(reviewId, toastId) {
        try {
            await api.delete(`/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setReviews((currentReviews) => currentReviews.filter((review) => review._id !== reviewId));
            setTotalReviews((currentTotal) => Math.max(0, currentTotal - 1));
            toast.dismiss(toastId);
            toast.success("Review deleted everywhere");
        } catch (error) {
            toast.dismiss(toastId);
            toast.error(error.response?.data?.message || "Could not delete review");
        }
    }

    async function hideReviewFromAdmin(reviewId, toastId) {
        try {
            await api.put(`/reviews/${reviewId}/admin-visibility`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setReviews((currentReviews) => currentReviews.filter((review) => review._id !== reviewId));
            setTotalReviews((currentTotal) => Math.max(0, currentTotal - 1));
            toast.dismiss(toastId);
            toast.success("Review removed from the admin list");
        } catch (error) {
            toast.dismiss(toastId);
            toast.error(error.response?.data?.message || "Could not remove review from admin list");
        }
    }

    function showDeleteOptions(review) {
        toast.custom((t) => (
            <div className="flex min-h-[190px] w-[420px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
                <div className="flex h-12 w-full items-center justify-between bg-accent px-5 text-base font-semibold text-white">
                    <span>Delete review</span>
                    <button onClick={() => toast.dismiss(t.id)} className="flex h-8 w-8 items-center justify-center rounded-full text-xl leading-none transition hover:bg-white/15" aria-label="Close delete confirmation">×</button>
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                    <p className="text-semibold leading-6 text-slate-600" align="center"> Where you want to remove this review?</p>
                    <div className="mt-3 grid w-full grid-cols-2 gap-3">
                        <button onClick={() => deleteReview(review._id, t.id)} className="h-11 rounded-lg bg-red-900 px-3 text-xs font-semibold text-white transition hover:bg-red-700">Delete everywhere</button>
                        <button onClick={() => hideReviewFromAdmin(review._id, t.id)} className="h-11 rounded-lg bg-slate-700 px-3 text-xs font-semibold text-white transition hover:bg-slate-500">Admin list only</button>
                    </div>
                </div>
            </div>
        ), { duration: Infinity, toasterId: "delete-confirmations" });
    }

    useEffect(() => {
        api.get("/reviews", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }).then((response) => {
            setReviews(response.data.reviews);
            setTotalReviews(response.data.totalCount);
        }).catch(() => {
            toast.error("Could not load reviews");
        }).finally(() => {
            setLoading(false);
        });
    }, [refreshKey]);

    if (loading) return <LoadingAnimation />;

    return (
        <div className="w-full max-h-full overflow-y-auto p-4">
            <div className="mb-8 flex min-h-[100px] w-full items-center justify-between rounded-md bg-white p-4 shadow-md">
                <div className="flex w-full flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-secondary">Customer Reviews</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-700">{totalReviews} review{totalReviews === 1 ? "" : "s"}</span>
                        <button onClick={() => { setLoading(true); setRefreshKey((key) => key + 1); }} className="rounded bg-accent px-4 py-2 font-medium text-white hover:bg-blue-900">Refresh</button>
                    </div>
                </div>
            </div>
            <div className="space-y-3 pb-10">
                {reviews.length === 0 ? (
                    <p className="rounded-md bg-white p-6 text-center text-slate-600 shadow-sm">No reviews yet.</p>
                ) : reviews.map((review) => (
                    <article key={review._id} className="rounded-lg border border-slate-100 bg-white p-4 shadow-sm">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="font-semibold text-accent">{review.name}</h2>
                                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-accent">{review.rating}/5 stars</span>
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${review.isPublished ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                                        {review.status || (review.isPublished ? "Published" : "Pending")}
                                    </span>
                                </div>
                                <p className="mt-1 truncate text-xs text-slate-500">{review.email} &middot; {new Date(review.date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                                <button onClick={() => updateVisibility(review)} className={`rounded-md px-3 py-1.5 text-xs font-semibold text-white ${review.isPublished ? "bg-slate-600 hover:bg-slate-700" : "bg-green-600 hover:bg-green-700"}`}>
                                    {review.isPublished ? "Unpublish" : "Publish"}
                                </button>
                                <button onClick={() => showDeleteOptions(review)} className="rounded-md border border-red-100 bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:border-red-200 hover:bg-red-700 hover:text-white">Delete</button>
                            </div>
                        </div>
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-800">{review.message}</p>
                    </article>
                ))}
            </div>
        </div>
    );
}
