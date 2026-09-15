import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiCalendar, FiStar } from "react-icons/fi";
import UserContext from "../context/userContext";
import api from "../lib/api";

export default function ReviewsPage() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(5);
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);
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
        const form = event.currentTarget;

        if (!user) {
            toast.error("Please log in to submit a review");
            navigate("/login");
            return;
        }

        setSubmitting(true);

        try {
            const response = await api.post("/reviews", {
                rating,
                message,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            form.reset();
            setMessage("");
            setRating(5);
            setSubmitted(true);
            toast.success(response.data.message || "Thank you for your review");
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not submit your review");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="min-h-full w-full bg-primary px-4 py-8 sm:px-6 lg:px-12 lg:py-12">
            <section className="mx-auto max-w-5xl">
                <div className="mb-7 text-center">
                    <div className="flex items-center justify-center gap-3 text-blue-500" aria-hidden="true"><span className="h-px w-10 bg-blue-400" /><FiStar className="fill-current text-2xl" /><span className="h-px w-10 bg-blue-400" /></div>
                    <h1 className="mt-3 text-3xl font-bold text-accent sm:text-4xl">Customer Reviews</h1>
                    <p className="mt-2 text-sm text-slate-600 sm:text-base">Real feedback from our valued customers.</p>
                    <span className="mt-3 inline-block rounded-full bg-accent px-3 py-1 text-sm font-semibold text-white shadow-sm">{reviews.length} review{reviews.length === 1 ? "" : "s"}</span>
                </div>

                <div>
                    <div className="grid gap-4 md:grid-cols-2">
                        {reviews.length === 0 ? (
                            <p className="md:col-span-2 rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-600">No reviews yet. Be the first to share your experience.</p>
                        ) : reviews.map((review) => (
                            <article key={review._id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-semibold text-blue-700">
                                            <span>{review.name?.trim()?.charAt(0)?.toUpperCase() || "U"}</span>
                                            {review.userImage && <img src={review.userImage} alt={`${review.name}'s profile`} className="absolute inset-0 h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="truncate font-semibold text-slate-900">{review.name}</h3>
                                            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><FiCalendar aria-hidden="true" />{new Date(review.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-600"><FiStar className="fill-current" aria-hidden="true" />{review.rating} / 5</span>
                                </div>
                                <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700"><span className="mr-2 text-2xl font-bold leading-none text-blue-400" aria-hidden="true">“</span>{review.message}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-10 max-w-5xl rounded-2xl bg-blue-950/95 p-5 sm:p-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-10">
                <div className="flex items-center gap-3 lg:items-start">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-xl text-accent"><FiStar aria-hidden="true" /></span>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Write a review</h2>
                        <p className="mt-1 text-sm text-white">Tell us about your experience with ISURI Computers.</p>
                    </div>
                </div>
                <form className="mt-5 space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:mt-0" onSubmit={handleSubmit}>
                    <p className="text-sm text-slate-600">
                        {user ? `Submitting as ${user.email}.` : "Please sign in before submitting your review."}
                    </p>
                    {submitted && <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">Thanks for your valuable review! 😊
We truly appreciate your feedback! ✨</p>}
                    <div>
                        <p className="mb-2 text-sm font-medium text-slate-700">Your rating</p>
                        <div className="flex justify-center gap-2" role="radiogroup" aria-label="Your rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} type="button" onClick={() => setRating(star)} className={`rounded p-1 text-3xl transition focus:outline-none focus:ring-2 focus:ring-accent/30 ${star <= rating ? "text-amber-400" : "text-slate-300"}`} aria-label={`${star} star${star === 1 ? "" : "s"}`} aria-pressed={rating === star}>
                                    <FiStar className={star <= rating ? "fill-current" : ""} aria-hidden="true" />
                                </button>
                            ))}
                        </div>
                        <p className="mt-1 text-center text-sm text-slate-600">{rating} out of 5 stars</p>
                    </div>
                    <div>
                        <label htmlFor="review-message" className="mb-1 block text-sm font-medium text-slate-700">Your review</label>
                        <textarea id="review-message" name="message" value={message} onChange={(event) => setMessage(event.target.value)} required rows="5" maxLength="1000" className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15" placeholder="Tell us about your experience" />
                        <p className="mt-1 text-right text-xs text-slate-500">{message.length}/1000</p>
                    </div>
                    <button type="submit" disabled={submitting || !message.trim()} className="w-full rounded-lg bg-accent px-5 py-3 font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60">
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
