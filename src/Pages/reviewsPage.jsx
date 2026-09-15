import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiStar } from "react-icons/fi";
import UserContext from "../context/userContext";
import api from "../lib/api";

export default function ReviewsPage() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(5);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        api.get("/reviews/public").then((response) => {
            setReviews(response.data);
        }).catch(() => {
            setReviews([]);
        });
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();

        if (!user) {
            toast.error("Please log in to submit a review");
            navigate("/login");
            return;
        }

        setSubmitting(true);

        try {
            const response = await api.post("/reviews", {
                rating,
                message: new FormData(event.currentTarget).get("message"),
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            event.currentTarget.reset();
            setRating(5);
            setReviews((currentReviews) => [response.data.review, ...currentReviews]);
            toast.success("Thank you for your review");
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not submit your review");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="w-full bg-primary px-6 py-12 lg:px-12">
            <section className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-sm sm:p-8">
                <div className="text-center">
                    <FiStar className="mx-auto text-3xl text-accent" aria-hidden="true" />
                    <h1 className="mt-3 text-3xl font-bold text-accent">Customer reviews</h1>
                    <p className="mt-3 text-slate-600">See what customers say about ISURI Computers.</p>
                </div>

                <div className="mt-7">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {reviews.length === 0 ? (
                            <p className="sm:col-span-2 text-center text-sm text-slate-600">No reviews yet.</p>
                        ) : reviews.map((review) => (
                            <article key={review._id} className="rounded-lg bg-slate-50 p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="font-semibold text-slate-900">{review.name}</h3>
                                    <span className="text-sm font-medium text-amber-500">{review.rating} / 5 stars</span>
                                </div>
                                <p className="mt-1 text-xs text-slate-500">{new Date(review.date).toLocaleDateString()}</p>
                                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{review.message}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-8 max-w-2xl rounded-lg bg-white p-6 shadow-sm sm:p-8">
                <div className="text-center">
                    <FiStar className="mx-auto text-3xl text-accent" aria-hidden="true" />
                    <h2 className="mt-3 text-2xl font-bold text-accent">Write a review</h2>
                    <p className="mt-2 text-sm text-slate-600">Tell us about your experience with ISURI Computers.</p>
                </div>
                <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <p className="mb-2 text-sm font-medium text-slate-700">Your rating</p>
                        <div className="flex justify-center gap-2" role="radiogroup" aria-label="Your rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} type="button" onClick={() => setRating(star)} className={`rounded p-1 text-3xl ${star <= rating ? "text-amber-400" : "text-slate-300"}`} aria-label={`${star} star${star === 1 ? "" : "s"}`} aria-pressed={rating === star}>
                                    <FiStar className={star <= rating ? "fill-current" : ""} aria-hidden="true" />
                                </button>
                            ))}
                        </div>
                        <p className="mt-1 text-center text-sm text-slate-600">{rating} out of 5 stars</p>
                    </div>
                    <div>
                        <label htmlFor="review-message" className="mb-1 block text-sm font-medium text-slate-700">Your review</label>
                        <textarea id="review-message" name="message" required rows="5" maxLength="1000" className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-accent" placeholder="Tell us about your experience" />
                    </div>
                    <button type="submit" disabled={submitting} className="w-full rounded-lg bg-accent px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 hover:bg-blue-900">
                        {submitting ? "Submitting..." : "Submit review"}
                    </button>
                </form>
            </section>

            <section className="hidden mx-auto mt-10 max-w-4xl">
                <h2 className="text-center text-2xl font-bold text-accent">Customer reviews</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {reviews.length === 0 ? (
                        <p className="md:col-span-2 rounded-lg bg-white p-6 text-center text-slate-600 shadow-sm">No reviews yet.</p>
                    ) : reviews.map((review) => (
                        <article key={review._id} className="rounded-lg bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="font-semibold text-slate-900">{review.name}</h3>
                                <span className="text-sm font-medium text-amber-500">{review.rating} / 5 ★</span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">{new Date(review.date).toLocaleDateString()}</p>
                            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{review.message}</p>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
