import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCheckCircle, FiMonitor, FiShield } from "react-icons/fi";
import api from "../lib/api";

const defaultValues = [
    {
        icon: FiMonitor,
        title: "Technology that fits you",
        text: "We make it simple to find the right computer, accessories, and upgrades for everyday work, study, or play.",
    },
    {
        icon: FiShield,
        title: "Quality you can trust",
        text: "Every recommendation starts with dependable products and clear, practical advice you can use with confidence.",
    },
    {
        icon: FiCheckCircle,
        title: "Easy shopping",
        text: "Browse products and order what you need in one simple place.",
    },
];




export default function AboutPage() {
    const [content, setContent] = useState({
        title: "About ISURI Computers",
        introduction: "ISURI Computers helps you find reliable computers, accessories, and technology for your daily needs.",
        supportingText: "We make browsing and choosing products simple.",
        buttonText: "Explore products",
        values: defaultValues,
    });

    useEffect(() => {
        api.get("/content/about").then((response) => setContent((current) => ({ ...current, ...response.data }))).catch(() => {});
    }, []);

    return (
        <main className="w-full bg-primary px-6 py-12 text-slate-800 lg:px-12">
            <section className="mx-auto max-w-4xl text-center">

                <div className="mx-auto max-w-2xl">
                    <div>
                        <h1 className="text-3xl font-bold text-accent sm:text-4xl">
                            {content.title}
                        </h1>
                        <p className="mt-4 text-lg leading-8 text-slate-600">
                            {content.introduction}
                        </p>
                        <p className="mt-3 text-base leading-7 text-slate-600">{content.supportingText}</p>
                        <Link
                            to="/products"
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 font-semibold text-white hover:bg-blue-900"
                        >
                            {content.buttonText} <FiArrowRight aria-hidden="true" />
                        </Link>
                    </div>

                </div>
            </section>

            <section className="mx-auto max-w-4xl py-12">
                <div className="grid gap-5 md:grid-cols-3">
                    {content.values.map(({ title, text }, index) => {
                        const Icon = defaultValues[index % defaultValues.length]?.icon || FiCheckCircle;
                        return (
                        <article key={title} className="rounded-lg bg-white p-6 text-center shadow-sm">
                            <Icon className="mx-auto text-4xl text-accent" aria-hidden="true" />
                            <h2 className="mt-4 text-lg font-bold text-slate-900">{title}</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                        </article>
                    )})}
                </div>
            </section>

            {/*
                <FiUsers className="mx-auto text-4xl text-accent" aria-hidden="true" />
                <h2 className="mt-4 text-3xl font-bold text-slate-900">Let’s find the right setup for you.</h2>
                <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">From essential accessories to your next computer, I Computers is ready to make your choice easier.</p>
                <Link to="/products" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 font-semibold text-white transition hover:bg-blue-900">Shop now <FiArrowRight aria-hidden="true" /></Link>
            */}
        </main>
    );
}
