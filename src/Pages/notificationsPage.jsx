import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiBell, FiCheck, FiInbox } from "react-icons/fi";
import UserContext from "../context/userContext";
import api from "../lib/api";
import relativeNotificationTime from "../lib/notification-time";

export default function NotificationsPage({ admin = false, notificationTypes }) {
    const { user } = useContext(UserContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = useCallback(async () => {
        if (!user) return;
        try {
            const response = await api.get("/notifications", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
            setNotifications(notificationTypes?.length ? response.data.notifications.filter((item) => notificationTypes.includes(item.type)) : response.data.notifications);
        } catch (error) {
            console.error("Could not load notifications", error);
        } finally { setLoading(false); }
    }, [user, notificationTypes]);

    useEffect(() => {
        const initialLoad = window.setTimeout(loadNotifications, 0);
        return () => window.clearTimeout(initialLoad);
    }, [loadNotifications]);

    async function markAllAsRead() {
        await api.put("/notifications/read-all", notificationTypes?.length ? { types: notificationTypes } : {}, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        setNotifications((items) => items.map((item) => ({ ...item, readBy: item.readBy.includes(user.email) ? item.readBy : [...item.readBy, user.email] })));
    }

    async function markAsRead(id) {
        await api.put(`/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        setNotifications((items) => items.map((item) => item._id === id ? { ...item, readBy: [...item.readBy, user.email] } : item));
    }

    const unreadCount = notifications.filter((item) => !item.readBy.includes(user?.email)).length;
    return <main className={`mx-auto h-full w-full overflow-y-auto p-4 pb-24 sm:p-6 ${admin ? "max-w-5xl" : "max-w-3xl"}`}>
        <div className="mb-5 flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3"><span className="rounded-xl bg-blue-50 p-3 text-accent"><FiBell className="text-2xl" /></span><div><h1 className="text-xl font-bold text-secondary">Notifications</h1><p className="text-sm text-slate-500">{unreadCount ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}` : "You are all caught up"}</p></div></div>
            {unreadCount > 0 && <button onClick={markAllAsRead} className="flex items-center justify-center gap-1 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-dark"><FiCheck /> Mark all read</button>}
        </div>
        {loading ? <p className="p-6 text-center text-slate-500">Loading notifications…</p> : notifications.length === 0 ? <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-4 py-16 text-slate-500 shadow-sm"><FiInbox className="text-4xl" />No notifications yet</div> : <div className="overflow-hidden rounded-2xl bg-white shadow-sm">{notifications.map((notification) => {
            const isRead = notification.readBy.includes(user.email);
            return <Link key={notification._id} to={notification.link} onClick={() => { if (!isRead) markAsRead(notification._id); }} className={`flex gap-3 border-b border-slate-100 p-4 last:border-0 hover:bg-slate-50 sm:p-5 ${isRead ? "" : "bg-blue-50/70"}`}><span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${isRead ? "bg-slate-200" : "bg-accent"}`} />{admin && notification.type === "new-order" && <img src={notification.customerImage || "/images/default-profile.png"} alt={`${notification.customerName || "Customer"} profile`} className="h-11 w-11 shrink-0 rounded-full border border-slate-200 object-cover" />}<div className="min-w-0"><p className="font-semibold text-secondary">{notification.title}</p>{admin && notification.type === "new-order" && <p className="mt-0.5 text-xs font-semibold text-accent">{notification.customerName || "Customer"}</p>}<p className="mt-1 text-sm leading-6 text-slate-600">{notification.message}</p><p className="mt-1 text-xs text-slate-400">{relativeNotificationTime(notification.createdAt)}</p></div></Link>;
        })}</div>}
    </main>;
}
