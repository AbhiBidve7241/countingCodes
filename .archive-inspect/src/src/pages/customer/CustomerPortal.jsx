import React, { useState } from "react";
import { useGym } from "../../hooks/useGym";
import { MobileLayout } from "../../layouts/MobileLayout";
import { Card, Badge, Avatar, Button } from "../../components/UI";
import { 
  FiActivity, FiUser, FiInfo, 
  FiClock, FiAlertCircle, FiSend, FiPlus, 
  FiInstagram, FiYoutube, FiMessageSquare 
} from "react-icons/fi";
import { BsQrCode } from "react-icons/bs";
import { motion } from "framer-motion";

export const CustomerPortal = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { 
    members, 
    activeMemberId, 
    workoutLevels, 
    todaysProgress, 
    announcements, 
    addComplaint 
  } = useGym();

  const member = members.find(m => m.id === activeMemberId) || members[0];

  // Resolve exercises (either Master Workout or Today's Adjustment)
  const isAdjusted = !!member.todaysWorkoutAdjustment;
  const todayExercises = isAdjusted 
    ? member.todaysWorkoutAdjustment.exercises 
    : (workoutLevels[member.workoutLevel]?.exercises || []);
  
  // Support Form State
  const [supportCategory, setSupportCategory] = useState("Complaint");
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportSubject || !supportMessage) return;

    addComplaint({
      memberName: member.name,
      category: supportCategory,
      description: `${supportSubject}: ${supportMessage}`,
    });

    setSupportSubject("");
    setSupportMessage("");
    setSupportSubmitted(true);
    setTimeout(() => setSupportSubmitted(false), 4000);
  };

  // Render Subviews
  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-6">
            {/* QR Code Check-in Card */}
            <Card className="text-center p-6 bg-gradient-to-br from-violet-900/40 via-indigo-900/30 to-slate-900 border-violet-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-violet-400">Digital Access Card</h3>
              <div className="my-5 flex justify-center">
                <div className="p-4 bg-white rounded-2xl inline-block shadow-lg shadow-indigo-500/5">
                  {/* Mock QR layout */}
                  <div className="w-36 h-36 bg-slate-950 flex items-center justify-center p-2 rounded-lg">
                    <BsQrCode className="w-32 h-32 text-white" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-300 font-medium">Scan at front desk to register check-in</p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                MEMBERSHIP ACTIVE
              </div>
            </Card>

            {/* Today's Workout Snippet */}
            <Card hover onClick={() => setActiveTab("workout")} className="flex items-center justify-between p-4 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/25">
                  <FiActivity className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Today's Exercises</span>
                  <h4 className="text-sm font-bold text-white leading-tight">
                    {member.workoutLevel} {isAdjusted && <span className="text-[10px] text-amber-400 font-semibold">(Adjusted)</span>}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{todayExercises.length} Exercises targeted</p>
                </div>
              </div>
              <span className="text-xs text-slate-500 hover:text-white transition-colors font-semibold">View &rarr;</span>
            </Card>

            {/* Quick Metrics (Membership & Upcoming Test) */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Trainer in Charge</span>
                <h4 className="text-xs font-bold text-white mt-1">{member.todayTrainer}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Assigned duty</p>
              </Card>

              <Card className="p-4">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Upcoming Fitness Test</span>
                <h4 className="text-xs font-bold text-amber-400 mt-1">{member.upcomingTest}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Bi-weekly metric audit</p>
              </Card>
            </div>

            {/* Announcements Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider px-1">Announcements</h3>
              {announcements.map((ann) => (
                <Card key={ann.id} className="p-4 bg-slate-900/60 border-slate-800/60">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-white">{ann.title}</h4>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 uppercase">
                      {ann.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ann.content}</p>
                  <span className="text-[9px] text-slate-600 block mt-2">{ann.date}</span>
                </Card>
              ))}
            </div>
          </div>
        );

      case "workout":
        return (
          <div className="space-y-5">
            {/* Header with Workout status */}
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Daily Workout Schedule</h3>
                <p className="text-xs text-slate-400">Assigned level: <strong className="text-violet-400">{member.workoutLevel}</strong></p>
              </div>
              {isAdjusted && (
                <span className="text-[10px] bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Today's Adjusted Workout
                </span>
              )}
            </div>

            {isAdjusted && member.todaysWorkoutAdjustment.reason && (
              <div className="p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex gap-2.5 items-start">
                <FiInfo className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-400">Coach's Temporary Adjustment Notes</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    "Workout has been adjusted today for: <strong className="text-slate-300">{member.todaysWorkoutAdjustment.reason}</strong>."
                  </p>
                </div>
              </div>
            )}

            {/* Exercise List */}
            <div className="space-y-4">
              {todayExercises.map((ex, idx) => {
                // Check if progress exists for this member/exercise today
                const progress = todaysProgress[member.id]?.[ex.id];
                const isCompleted = progress?.completed;

                return (
                  <Card key={ex.id || idx} className="p-0 overflow-hidden border-slate-800 hover:border-slate-700/50">
                    <div className="flex">
                      {/* Image Thumbnail */}
                      <div className="w-24 h-24 shrink-0 relative bg-slate-900 border-r border-slate-800">
                        <img src={ex.image} alt={ex.name} className="w-full h-full object-cover" />
                        <div className="absolute top-1.5 left-1.5 bg-slate-950/80 px-2 py-0.5 rounded-md text-[9px] font-bold text-slate-300">
                          Ex {idx + 1}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-white tracking-wide">{ex.name}</h4>
                          {isCompleted ? (
                            <span className="p-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <FiSend className="w-3.5 h-3.5 rotate-45" /> {/* Complete indicator */}
                            </span>
                          ) : (
                            <span className="text-[9px] font-semibold text-slate-500 border border-slate-800 px-1.5 py-0.5 rounded-md">
                              Pending
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-2">
                          <div>
                            <span className="text-[10px] text-slate-500">Sets</span>
                            <p className="font-bold text-white mt-0.5">{ex.sets}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500">Reps</span>
                            <p className="font-bold text-white mt-0.5">{ex.reps}{ex.isTime ? 's' : ''}</p>
                          </div>
                          {progress && (
                            <>
                              <div className="border-l border-slate-800 pl-3">
                                <span className="text-[10px] text-violet-400 font-bold">Today's Wt</span>
                                <p className="font-extrabold text-violet-400 mt-0.5">{progress.weight} kg</p>
                              </div>
                              <div>
                                <span className="text-[10px] text-violet-400 font-bold">Reps Done</span>
                                <p className="font-extrabold text-violet-400 mt-0.5">{progress.reps}</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}

              {todayExercises.length === 0 && (
                <div className="text-center py-12">
                  <FiAlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                  <p className="text-xs text-slate-400 font-medium">No exercises assigned to this workout level.</p>
                </div>
              )}
            </div>
          </div>
        );

      case "support":
        return (
          <div className="space-y-6">
            <div className="border-b border-slate-900 pb-3">
              <h3 className="text-base font-bold text-white">Member Support Desk</h3>
              <p className="text-xs text-slate-400">File complaints, send feedback, or refer friends</p>
            </div>

            {/* Submission alert */}
            {supportSubmitted && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-2xl text-center">
                Success! Your ticket has been logged into the admin dashboard.
              </div>
            )}

            <form onSubmit={handleSupportSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase">Category</label>
                <div className="grid grid-cols-4 gap-2">
                  {["Complaint", "Feedback", "Enquiry", "Referral"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSupportCategory(cat)}
                      className={`py-2 px-1 text-center text-xs font-bold rounded-xl border transition-colors ${
                        supportCategory === cat
                          ? "bg-violet-500/10 border-violet-500 text-violet-400"
                          : "bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Summarize the issue..."
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/80 border border-slate-850 rounded-xl text-sm focus:outline-none focus:border-violet-500 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase">Message Details</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide details about your query..."
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/80 border border-slate-850 rounded-xl text-sm focus:outline-none focus:border-violet-500 text-white resize-none"
                />
              </div>

              <Button type="submit" className="w-full py-3">Submit Support Ticket</Button>
            </form>

            {/* Referral Info */}
            <Card className="p-5 border-violet-500/10 bg-slate-900/40 mt-4 text-center">
              <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider">Referral Program</span>
              <h4 className="text-sm font-bold text-white mt-1">Get 15 Days Free</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Refer your friends. When they sign up using your code, you both get 15 days added free.
              </p>
              <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded-xl inline-flex items-center gap-3">
                <code className="text-sm font-bold text-white font-mono">{member.referralCode}</code>
                <button 
                  onClick={() => alert("Copied referral link!")} 
                  className="text-xs text-violet-400 font-extrabold hover:underline"
                >
                  Copy Link
                </button>
              </div>
            </Card>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            {/* Top overview card */}
            <div className="text-center py-2">
              <Avatar src={member.photo} name={member.name} size="xl" className="mx-auto" />
              <h3 className="text-lg font-bold text-white mt-3">{member.name}</h3>
              <p className="text-xs text-slate-400 font-medium">Joined {member.membership.startDate}</p>
              
              <div className="mt-3 inline-flex items-center gap-2">
                <Badge variant="primary">{member.membership.type}</Badge>
                <Badge variant="success">LEVEL {member.workoutLevel.split(" ")[1]}</Badge>
              </div>
            </div>

            {/* Personal Training Package Details */}
            {member.ptPackage ? (
              <Card className="p-4 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Personal Training Dashboard</h4>
                  <Badge variant="info">Active Tracker</Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900">
                    <span className="text-[9px] text-slate-500 block uppercase">Purchased</span>
                    <strong className="text-base text-white">{member.ptPackage.sessionsPurchased}</strong>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900">
                    <span className="text-[9px] text-slate-500 block uppercase">Completed</span>
                    <strong className="text-base text-emerald-400">{member.ptPackage.completed}</strong>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900">
                    <span className="text-[9px] text-slate-500 block uppercase">Remaining</span>
                    <strong className="text-base text-violet-400">{member.ptPackage.remaining}</strong>
                  </div>
                </div>

                <div className="text-xs text-slate-400 flex justify-between">
                  <span>Assigned Trainer:</span>
                  <strong className="text-slate-200">{member.ptPackage.trainerName}</strong>
                </div>

                {/* Session Sign-off log */}
                <div className="space-y-2 mt-2">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Recent Session Audits</span>
                  {member.ptPackage.history.map((h, i) => (
                    <div key={i} className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400 font-bold">{h.date} &bull; {h.checkIn} - {h.checkOut}</span>
                        <span className="text-emerald-400 font-bold">Verified ✅</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-tight italic">"{h.notes}"</p>
                      <div className="flex gap-4 justify-end text-[9px] text-slate-500 pt-1 border-t border-slate-900 mt-1">
                        <span>Mem. Sig: <strong className="text-slate-400">{h.memberSig}</strong></span>
                        <span>Trn. Sig: <strong className="text-slate-400">{h.trainerSig}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <Card className="p-4 text-center">
                <span className="text-[9px] text-slate-500 block uppercase">PT Package</span>
                <p className="text-xs text-slate-400 mt-1">You are not subscribed to a personal coach.</p>
                <Button variant="outline" size="sm" className="mt-3">Inquire about Coach pricing</Button>
              </Card>
            )}

            {/* Attendance & Fitness Test History Logs */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider px-1">Attendance Tracker</h4>
              <Card className="p-4">
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold text-slate-500 pb-2 border-b border-slate-900">
                  <span>Date</span>
                  <span>Status</span>
                  <span>In</span>
                  <span>Out</span>
                </div>
                <div className="divide-y divide-slate-900">
                  {member.attendance.map((att, i) => (
                    <div key={i} className="grid grid-cols-4 gap-2 py-2.5 text-center text-xs">
                      <span className="text-slate-300 font-medium">{att.date.split("-")[2]}/{att.date.split("-")[1]}</span>
                      <span className="text-emerald-400 font-semibold">{att.status}</span>
                      <span className="text-slate-400">{att.checkIn || "--"}</span>
                      <span className="text-slate-400">{att.checkOut || "--"}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Fitness Test Metrics history list */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider px-1">Fitness Test History</h4>
              {member.fitnessTestHistory.map((test, index) => (
                <Card key={index} className="p-4 space-y-3 bg-slate-900/60">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-white">Test Date: {test.date}</span>
                    <Badge variant="primary">BMI: {test.general.bmi}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400">
                    <div>
                      <span>Weight</span>
                      <p className="font-bold text-white text-xs mt-0.5">{test.general.weight} kg</p>
                    </div>
                    <div>
                      <span>Body Fat</span>
                      <p className="font-bold text-white text-xs mt-0.5">{test.general.bodyFat}%</p>
                    </div>
                    <div>
                      <span>Muscle Mass</span>
                      <p className="font-bold text-white text-xs mt-0.5">{test.general.muscleMass} kg</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-800/50 flex gap-4 text-[10px] text-slate-500">
                    <span>Chest: <strong>{test.measurements.chest}cm</strong></span>
                    <span>Waist: <strong>{test.measurements.waist}cm</strong></span>
                    <span>Bench 1RM: <strong>{test.strength.benchPress}kg</strong></span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Social media connections */}
            <div className="space-y-3 pt-2 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Connect With Us</span>
              <div className="flex justify-center gap-4">
                <a href="#instagram" className="p-3 bg-slate-900 hover:bg-slate-800 rounded-2xl text-slate-300 hover:text-pink-400 transition-colors">
                  <FiInstagram className="w-5 h-5" />
                </a>
                <a href="#youtube" className="p-3 bg-slate-900 hover:bg-slate-800 rounded-2xl text-slate-300 hover:text-red-500 transition-colors">
                  <FiYoutube className="w-5 h-5" />
                </a>
                <a href="#whatsapp" className="p-3 bg-slate-900 hover:bg-slate-800 rounded-2xl text-slate-300 hover:text-emerald-400 transition-colors">
                  <FiMessageSquare className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <MobileLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </MobileLayout>
  );
};
