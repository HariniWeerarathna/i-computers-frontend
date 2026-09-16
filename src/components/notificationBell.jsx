import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBell, FiCheck, FiChevronRight, FiInbox } from "react-icons/fi";
import UserContext from "../context/userContext";
import api from "../lib/api";
import relativeNotificationTime from "../lib/notification-time";

export default function NotificationBell({ buttonClassName = "", notificationPagePath = "/notifications", showUnreadOnly = false, showViewAll = true, notificationTypes, autoOpenModal = false, buttonDestination, autoClearReadAt, hideButton = false }) {
    const { user } = useContext(UserContext);
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const hasOpenedForUnread = useRef(false);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    const loadNotifications = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token || !user) return;

        try {
            const response = await api.get("/notifications", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const matchingNotifications = notificationTypes?.length ? response.data.notifications.filter((item) => notificationTypes.includes(item.type)) : response.data.notifications;
            const matchingUnreadCount = matchingNotifications.filter((item) => !item.readBy.includes(user.email)).length;
            const matchingReadCount = matchingNotifications.filter((item) => item.readBy.includes(user.email)).length;
            setNotifications(matchingNotifications);
            setUnreadCount(matchingUnreadCount);
            if (autoClearReadAt && matchingReadCount > autoClearReadAt) {
                await api.delete("/notifications/read", { headers: { Authorization: `Bearer ${token}` }, data: notificationTypes?.length ? { types: notificationTypes } : {} });
                setNotifications((items) => items.filter((item) => !item.readBy.includes(user.email)));
            }
            if (matchingUnreadCount > 0 && !hasOpenedForUnread.current) {
                if (autoOpenModal) setLoginModalOpen(true);
                else setIsOpen(true);
                hasOpenedForUnread.current = true;
            }
        } catch (error) {
            // Notifications should not interrupt normal navigation when unavailable.
            console.error("Could not load notifications", error);
        }
    }, [user, notificationTypes, autoOpenModal, autoClearReadAt]);

    useEffect(() => {
        const initialLoad = window.setTimeout(loadNotifications, 0);
        const interval = window.setInterval(loadNotifications, 30000);
        return () => {
            window.clearTimeout(initialLoad);
            window.clearInterval(interval);
        };
    }, [loadNotifications]);

    useEffect(() => {
        function closeOnOutsideClick(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
        }
        document.addEventListener("mousedown", closeOnOutsideClick);
        return () => document.removeEventListener("mousedown", closeOnOutsideClick);
    }, []);

    async function markAsRead(notificationId) {
        const token = localStorage.getItem("token");
        try {
            await api.put(`/notifications/${notificationId}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications((items) => items.map((item) => item._id === notificationId
                ? { ...item, readBy: [...item.readBy, user.email] }
                : item));
            setUnreadCount((count) => Math.max(0, count - 1));
        } catch (error) {
            console.error("Could not update notification", error);
        }
    }

    async function markAllAsRead() {
        const token = localStorage.getItem("token");
        try {
            await api.put("/notifications/read-all", notificationTypes?.length ? { types: notificationTypes } : {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications((items) => items.map((item) => ({
                ...item,
                readBy: item.readBy.includes(user.email) ? item.readBy : [...item.readBy, user.email]
            })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Could not update notifications", error);
        }
    }

    if (!user) return null;

    const visibleNotifications = (showUnreadOnly ? notifications.filter((item) => !item.readBy.includes(user.email)) : notifications).slice(0, 5);

    return (
        <div ref={containerRef} className="relative">
            {!hideButton && <button
                type="button"
                onClick={() => buttonDestination ? navigate(buttonDestination) : setIsOpen((open) => !open)}
                className={`relative flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-white/15 ${buttonClassName}`}
                aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ""}`}
                aria-expanded={isOpen}
            >
                <FiBell className="text-2xl" />
                {unreadCount > 0 && <span className="absolute right-0 top-0 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold leading-5 text-white">{unreadCount > 99 ? "99+" : unreadCount}</span>}
            </button>}

            {(isOpen || loginModalOpen) && <>
                {loginModalOpen && <button type="button" onClick={() => setLoginModalOpen(false)} className="fixed inset-0 z-[70] cursor-default bg-slate-950/35 backdrop-blur-sm" aria-label="Close notifications" />}
                <div className={loginModalOpen ? "fixed left-1/2 top-1/2 z-[71] w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-2xl" : "fixed inset-x-3 top-[84px] z-[70] mx-auto w-auto max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-2xl sm:absolute sm:right-0 sm:left-auto sm:top-full sm:mt-2 sm:w-[23rem]"}>
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
                    <div><h2 className="font-bold">Notifications</h2><p className="text-xs text-slate-500">{unreadCount ? `${unreadCount} unread` : "You are all caught up"}</p></div>
                    {unreadCount > 0 && <button type="button" onClick={markAllAsRead} className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline"><FiCheck /> Mark all read</button>}
                </div>
                <div className="max-h-[min(55vh,25rem)] overflow-y-auto">
                    {visibleNotifications.length === 0 ? <div className="flex flex-col items-center gap-2 px-4 py-10 text-sm text-slate-500"><FiInbox className="text-3xl" />{showUnreadOnly ? "No unread notifications" : "No notifications yet"}</div> : visibleNotifications.map((notification) => {
                        const isRead = notification.readBy.includes(user.email);
                        return <Link key={notification._id} to={notification.link} onClick={() => { if (!isRead) markAsRead(notification._id); setIsOpen(false); setLoginModalOpen(false); }} className={`block border-b border-slate-100 px-4 py-3 last:border-0 hover:bg-slate-50 ${isRead ? "" : "bg-blue-50/70"}`}>
                            <div className="flex gap-2">
                                {!isRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />}
                                <div className={isRead ? "pl-4" : ""}>
                                    <p className="text-sm font-semibold">{notification.title}</p>
                                    <p className="mt-0.5 text-xs leading-5 text-slate-600">{notification.message}</p>
                                    <p className="mt-1 text-[11px] text-slate-400">{relativeNotificationTime(notification.createdAt)}</p>
                                </div>
                            </div>
                        </Link>;
                    })}
                </div>
                {showViewAll && <Link to={notificationPagePath} onClick={() => { setIsOpen(false); setLoginModalOpen(false); }} className="flex items-center justify-center gap-1 border-t border-slate-100 px-4 py-3 text-sm font-semibold text-accent hover:bg-blue-50">View all notifications <FiChevronRight /></Link>}
                </div>
            </>}
        </div>
    );
}
