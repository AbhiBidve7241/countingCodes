import React, { useState } from "react";
import { useGym } from "../hooks/useGym";
import { Avatar, Button } from "../components/UI";
import { 
  FiLayout, FiUsers, FiTrendingUp, FiLayers, 
  FiCheckSquare, FiAlertCircle, FiHeart, FiFileText, 
  FiSettings, FiLogOut, FiMenu, FiX, FiBell 
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export const SidebarLayout = ({ activeTab, setActiveTab, children }) => {
  const { setActiveRole, notifications, markAllNotificationsRead } = useGym();
  const [isOpen, setIsOpen] = useState(true);
  const [showNotif, setShowNotif] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: FiLayout },
    { id: "members", label: "Members", icon: FiUsers },
    { id: "trainers", label: "Trainers", icon: FiUsers }, // using same icon pattern but styled differently
    { id: "sales", label: "Sales CRM", icon: FiTrendingUp },
    { id: "workouts", label: "Workout Levels", icon: FiLayers },
    { id: "attendance", label: "Attendance Logs", icon: FiCheckSquare },
    { id: "complaints", label: "Complaints", icon: FiAlertCircle },
    { id: "fitness", label: "Fitness Tests", icon: FiHeart },
    { id: "reports", label: "Reports & Charts", icon: FiFileText },
    { id: "settings", label: "Settings", icon: FiSettings }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-100 font-sans">
      {/* Sidebar navigation */}
      <aside 
        className={`glass border-r border-slate-900 h-screen sticky top-0 z-50 flex flex-col transition-all duration-350 ${
          isOpen ? "w-64" : "w-20"
        } hidden md:flex`}
      >
        {/* Brand header */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-900 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-500/20 shrink-0">
            AG
          </div>
          {isOpen && (
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              ANTIGRAVITY
            </span>
          )}
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-semibold relative text-sm group ${
                  isActive 
                    ? "text-violet-400 font-bold bg-violet-500/5 border border-violet-500/20" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-violet-400' : 'text-slate-400'}`} />
                {isOpen && <span>{item.label}</span>}
                {!isOpen && (
                  <div className="absolute left-24 px-3 py-1.5 bg-slate-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg border border-slate-800 tracking-wide">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* User / Logout Area */}
        <div className="p-4 border-t border-slate-900 space-y-3 shrink-0">
          {isOpen && (
            <div className="flex items-center gap-3 px-2">
              <Avatar name="Admin User" size="sm" />
              <div>
                <h4 className="text-xs font-bold text-white">System Admin</h4>
                <span className="text-[10px] text-slate-500 tracking-wider">HQ OVERSEER</span>
              </div>
            </div>
          )}
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => setActiveRole("login")} 
            className="w-full flex items-center justify-center gap-2 border border-slate-800 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-400"
          >
            <FiLogOut className="w-4 h-4" />
            {isOpen && <span>Exit Portal</span>}
          </Button>
        </div>
      </aside>

      {/* Main panel container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Admin topbar */}
        <header className="glass px-6 py-4 flex items-center justify-between border-b border-slate-900 shrink-0 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-colors hidden md:block"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold tracking-tight text-white capitalize">
              {activeTab} Management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotif(!showNotif);
                  if (!showNotif) markAllNotificationsRead();
                }}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors relative"
              >
                <FiBell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotif && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="absolute right-0 mt-2 w-80 glass border border-slate-800 rounded-2xl p-4 shadow-xl z-50 max-h-96 overflow-y-auto no-scrollbar"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Alert Center</h4>
                        <button onClick={markAllNotificationsRead} className="text-[10px] text-violet-400 font-bold hover:underline">Mark all read</button>
                      </div>
                      <div className="space-y-2">
                        {notifications.map((notif) => (
                          <div key={notif.id} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/40 flex items-start gap-2.5">
                            <div className="text-[14px]">
                              {notif.type === "Birthday" ? "🎂" : 
                               notif.type === "Fitness Test Reminder" ? "📋" : 
                               notif.type === "Membership Renewal" ? "⚠️" : 
                               notif.type === "Absent 5 Days" ? "🚨" : 
                               notif.type === "Referral Reward" ? "🎁" : "📢"}
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-slate-200 leading-tight">{notif.message}</p>
                              <span className="text-[9px] text-slate-500 block mt-1">{notif.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            {/* Quick switcher link */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setActiveRole("login")} 
              className="text-xs py-2 px-3 border-violet-500/20"
            >
              Switch Role
            </Button>
          </div>
        </header>

        {/* Viewport for contents */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto pb-16">
          {children}
        </main>
      </div>
    </div>
  );
};
