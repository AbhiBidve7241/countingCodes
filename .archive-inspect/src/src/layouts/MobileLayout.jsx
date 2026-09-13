import React, { useState } from "react";
import { useGym } from "../hooks/useGym";
import { Avatar, Badge, Button } from "../components/UI";
import { 
  FiHome, FiActivity, FiHelpCircle, FiUser, 
  FiCamera, FiUsers, FiCalendar, FiInbox, 
  FiLogOut, FiBell, FiShield, FiTrendingUp 
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export const MobileLayout = ({ activeTab, setActiveTab, children }) => {
  const { activeRole, setActiveRole, members, activeMemberId, notifications, markAllNotificationsRead } = useGym();
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  // Find active customer info
  const activeMember = members.find(m => m.id === activeMemberId) || members[0];
  const unreadCount = notifications.filter(n => n.unread).length;

  // Determine nav items based on role
  const getNavItems = () => {
    switch (activeRole) {
      case "customer":
        return [
          { id: "home", label: "Home", icon: FiHome },
          { id: "workout", label: "Workout", icon: FiActivity },
          { id: "support", label: "Support", icon: FiHelpCircle },
          { id: "profile", label: "Profile", icon: FiUser }
        ];
      case "trainer":
        return [
          { id: "dashboard", label: "Dashboard", icon: FiTrendingUp },
          { id: "scanner", label: "Scanner", icon: FiCamera },
          { id: "members", label: "Members", icon: FiUsers },
          { id: "profile", label: "Profile", icon: FiUser }
        ];
      case "sales":
        return [
          { id: "dashboard", label: "Dashboard", icon: FiTrendingUp },
          { id: "enquiries", label: "Enquiries", icon: FiInbox },
          { id: "followups", label: "Follow Ups", icon: FiCalendar },
          { id: "profile", label: "Profile", icon: FiUser }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col max-w-md mx-auto shadow-2xl border-x border-slate-900 overflow-hidden pb-24">
      {/* Dynamic Top Bar */}
      <header className="glass sticky top-0 z-40 flex items-center justify-between px-5 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <Avatar 
            src={activeRole === "customer" ? activeMember.photo : undefined} 
            name={activeRole === "customer" ? activeMember.name : activeRole === "trainer" ? "Coach Vikram" : "Sales Executive"} 
            size="sm" 
          />
          <div>
            <h2 className="text-sm font-bold text-white leading-none">
              {activeRole === "customer" ? activeMember.name.split(" ")[0] : activeRole === "trainer" ? "Coach Vikram" : "Sales Team"}
            </h2>
            <span className="text-[10px] text-slate-400 capitalize tracking-wide font-medium">
              Portal: <strong className="text-violet-400">{activeRole}</strong>
            </span>
          </div>
        </div>

        {/* Notifications and Logout Switch */}
        <div className="flex items-center gap-2">
          {/* Notifications Trigger */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                if (!showNotifMenu) markAllNotificationsRead();
              }}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors relative"
            >
              <FiBell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Menu */}
            <AnimatePresence>
              {showNotifMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute right-0 mt-2 w-72 glass-light border border-slate-800 rounded-2xl p-4 shadow-xl z-50 max-h-96 overflow-y-auto no-scrollbar"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Notifications</h4>
                      <button onClick={markAllNotificationsRead} className="text-[10px] text-violet-400 font-semibold hover:underline">Mark all read</button>
                    </div>
                    <div className="space-y-2">
                      {notifications.map((notif) => (
                        <div key={notif.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/40 flex items-start gap-2.5">
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

          {/* Quick Role Select Shortcut */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setActiveRole("login")} 
            className="p-2.5 border border-slate-800 rounded-xl bg-slate-900 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20"
          >
            <FiLogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Page Content Scrollable Area */}
      <main className="flex-1 overflow-y-auto px-5 py-6 no-scrollbar">
        {children}
      </main>

      {/* Floating Bottom Nav */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-[390px] h-16 glass rounded-2xl flex items-center justify-around px-4 shadow-xl z-40 border border-slate-800/70">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center justify-center w-12 h-12 rounded-xl text-slate-400 focus:outline-none"
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavBG"
                  className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 rounded-xl border border-violet-500/20"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className={`w-5 h-5 transition-colors duration-250 ${isActive ? 'text-violet-400' : 'text-slate-400'}`} />
              <span className={`text-[9px] font-semibold tracking-wide uppercase mt-1 transition-colors ${isActive ? 'text-violet-300' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
