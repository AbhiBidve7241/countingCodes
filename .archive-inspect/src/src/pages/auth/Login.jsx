import React from "react";
import { useGym } from "../../hooks/useGym";
import { Card, Button } from "../../components/UI";
import { FiUser, FiActivity, FiBriefcase, FiShield } from "react-icons/fi";
import { motion } from "framer-motion";

export const Login = () => {
  const { setActiveRole, setActiveMemberId } = useGym();

  const roles = [
    {
      id: "customer",
      title: "Customer Portal",
      desc: "View workouts, check-in QR, support requests, and digital fitness test cards.",
      icon: FiUser,
      color: "from-violet-500 to-indigo-500",
      shadow: "shadow-violet-500/20",
      action: () => {
        setActiveMemberId("mem_1"); // Default to Rahul Sharma
        setActiveRole("customer");
      }
    },
    {
      id: "trainer",
      title: "Trainer Portal",
      desc: "Track check-ins, record fitness tests, and adjust workouts in today's adjustments.",
      icon: FiActivity,
      color: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/20",
      action: () => setActiveRole("trainer")
    },
    {
      id: "sales",
      title: "Sales Portal",
      desc: "Manage enquiries pipeline, record sales follow-ups, and track absent member list.",
      icon: FiBriefcase,
      color: "from-amber-500 to-orange-500",
      shadow: "shadow-amber-500/20",
      action: () => setActiveRole("sales")
    },
    {
      id: "admin",
      title: "Admin Dashboard",
      desc: "HQ control. Manage program levels, view growth analytics, and check performance logs.",
      icon: FiShield,
      color: "from-rose-500 to-pink-500",
      shadow: "shadow-rose-500/20",
      action: () => setActiveRole("admin")
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient spots */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-xl shadow-violet-500/20 mx-auto">
          AG
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white font-sans">
          Antigravity Gyms
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Proof of Concept Portal Selector
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl z-10">
        <Card className="p-8 border border-slate-900 shadow-2xl">
          <div className="mb-6 pb-6 border-b border-slate-800/80 text-center sm:text-left">
            <h3 className="text-lg font-bold text-white tracking-wide">Choose Role Persona</h3>
            <p className="text-xs text-slate-400 mt-1">
              Select one of the gym workflow personas below to enter the portal instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <motion.div
                  key={role.id}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={role.action}
                  className="glass p-5 rounded-2xl border border-slate-800 hover:border-slate-700/60 cursor-pointer flex flex-col justify-between transition-all"
                >
                  <div className="space-y-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white shadow-md ${role.shadow}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide">{role.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {role.desc}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-end">
                    <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider group-hover:underline">
                      Enter Portal &rarr;
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
            <p className="text-[10px] text-slate-500 tracking-wide uppercase font-medium">
              SaaS Engine POC &bull; Built in React with Tailwind CSS
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
