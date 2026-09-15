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

    async function deleteReview(reviewId) {
        if (!window.confirm("Delete this review?")) return;

        try {
            await api.delete(`/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setReviews((currentReviews) => currentReviews.filter((review) => review._id !== reviewId));
            setTotalReviews((currentTotal) => currentTotal - 1);
            toast.success("Review deleted");
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not delete review");
        }
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
            <div className="mb-6 rounded-md bg-white p-5 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-secondary">Customer Reviews</h1>
                        <p className="mt-1 text-sm text-slate-600">Publish pending reviews to show them to customers.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-700">{totalReviews} review{totalReviews === 1 ? "" : "s"}</span>
                        <button onClick={() => { setLoading(true); setRefreshKey((key) => key + 1); }} className="rounded bg-accent px-4 py-2 font-medium text-white hover:bg-blue-900">Refresh</button>
                    </div>
                </div>
            </div>
            <div className="space-y-4 pb-10">
                {reviews.length === 0 ? (
                    <p className="rounded-md bg-white p-6 text-center text-slate-600 shadow-sm">No reviews yet.</p>
                ) : reviews.map((review) => (
                    <article key={review._id} className="rounded-md bg-white p-5 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h2 className="font-semibold text-accent">{review.name}</h2>
                            <div className="flex items-center gap-3">
                                <span className="font-medium text-accent">{review.rating}/5 stars</span>
                                {review.isPublished ? (
                                    <>
                                        <button onClick={() => updateVisibility(review)} className="rounded bg-slate-600 px-3 py-1 text-sm font-medium text-white hover:bg-slate-700">Hide</button>
                                        <button onClick={() => deleteReview(review._id)} className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700">Delete</button>
                                    </>
                                ) : (
                                    <button onClick={() => updateVisibility(review)} className="rounded bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700">Publish</button>
                                )}
                            </div>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{review.email} · {new Date(review.date).toLocaleDateString()}</p>
                        <p className={`mt-2 text-sm font-medium ${review.isPublished ? "text-green-700" : "text-amber-700"}`}>{review.status || (review.isPublished ? "Published" : "Pending")} — {review.isPublished ? "visible to customers" : "not visible to customers"}</p>
                        <p className="mt-4 whitespace-pre-wrap text-slate-700">{review.message}</p>
                    </article>
                ))}
            </div>
        </div>
    );
}
