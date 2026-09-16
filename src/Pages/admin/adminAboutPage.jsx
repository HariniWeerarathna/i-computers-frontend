import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiSave, FiTrash2 } from "react-icons/fi";
import api from "../../lib/api";
import LoadingAnimation from "../../components/loadingAnimation";

const emptyContent = {
    title: "",
    introduction: "",
    supportingText: "",
    buttonText: "",
    values: [{ title: "", text: "" }, { title: "", text: "" }, { title: "", text: "" }],
};

export default function AdminAboutPage() {
    const [content, setContent] = useState(emptyContent);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        api.get("/content/about")
            .then((response) => setContent({ ...emptyContent, ...response.data, values: response.data.values?.length ? response.data.values : emptyContent.values }))
            .catch(() => toast.error("Could not load the about page"))
            .finally(() => setLoading(false));
    }, []);

    function updateValue(index, field, value) {
        setContent((current) => ({
            ...current,
            values: current.values.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
        }));
    }

    function addValueCard() {
        setContent((current) => ({ ...current, values: [...current.values, { title: "", text: "" }] }));
    }

    function removeValueCard(index) {
        setContent((current) => ({ ...current, values: current.values.filter((_, itemIndex) => itemIndex !== index) }));
    }

    async function handleSave(event) {
        event.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            await api.put("/content/about", content, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("About page updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not update the about page");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="flex h-full items-center justify-center"><LoadingAnimation /></div>;

    return (
        <form onSubmit={handleSave} className="h-full overflow-y-auto p-3 pb-8 sm:p-5">
            <div className="mx-auto max-w-4xl rounded-2xl bg-white p-4 shadow-md sm:p-6">
                <div className="mb-6 flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-secondary">Edit About Page</h1>
                        <p className="mt-1 text-sm text-slate-500">Changes are shown on the public About page after saving.</p>
                    </div>
                    <button type="submit" disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-semibold text-white transition hover:bg-blue-900 disabled:opacity-60 sm:w-auto">
                        <FiSave />{saving ? "Saving..." : "Save changes"}
                    </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-semibold text-slate-700">Page title</span><input required value={content.title} onChange={(event) => setContent({ ...content, title: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15" /></label>
                    <label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-semibold text-slate-700">Introduction</span><textarea required rows="3" value={content.introduction} onChange={(event) => setContent({ ...content, introduction: event.target.value })} className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15" /></label>
                    <label><span className="mb-1.5 block text-sm font-semibold text-slate-700">Supporting text</span><textarea required rows="3" value={content.supportingText} onChange={(event) => setContent({ ...content, supportingText: event.target.value })} className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15" /></label>
                    <label><span className="mb-1.5 block text-sm font-semibold text-slate-700">Button label</span><input required value={content.buttonText} onChange={(event) => setContent({ ...content, buttonText: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15" /></label>
                </div>

                <div className="mt-7 flex items-center justify-between gap-3">
                    <h2 className="text-lg font-bold text-secondary">Value cards</h2>
                    <button type="button" onClick={addValueCard} className="inline-flex items-center gap-1.5 rounded-lg border border-accent px-3 py-2 text-sm font-semibold text-accent transition hover:bg-blue-50"><FiPlus /> Add card</button>
                </div>
                <div className="mt-3 grid gap-4 md:grid-cols-3">
                    {content.values.map((value, index) => <fieldset key={index} className="rounded-xl border border-slate-200 p-4"><div className="mb-2 flex items-center justify-between"><legend className="px-1 text-sm font-semibold text-accent">Card {index + 1}</legend>{content.values.length > 1 && <button type="button" onClick={() => removeValueCard(index)} className="rounded p-1.5 text-red-600 transition hover:bg-red-50" aria-label={`Remove card ${index + 1}`}><FiTrash2 /></button>}</div><label><span className="mb-1 block text-sm text-slate-600">Title</span><input required value={value.title} onChange={(event) => updateValue(index, "title", event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-accent" /></label><label className="mt-3 block"><span className="mb-1 block text-sm text-slate-600">Description</span><textarea required rows="5" value={value.text} onChange={(event) => updateValue(index, "text", event.target.value)} className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-accent" /></label></fieldset>)}
                </div>
            </div>
        </form>
    );
}
