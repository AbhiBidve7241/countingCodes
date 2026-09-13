import React, { useState } from "react";
import { useGym } from "../../hooks/useGym";
import { SidebarLayout } from "../../layouts/SidebarLayout";
import { Card, Badge, Avatar, Button, Accordion, StatCard } from "../../components/UI";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, BarChart, Bar, Legend, LineChart, 
  Line, PieChart, Pie, Cell 
} from "recharts";
import { 
  FiUsers, FiActivity, FiDollarSign, FiClock, 
  FiAlertCircle, FiClipboard, FiPlus, FiTrash2, FiSave, FiCheck 
} from "react-icons/fi";

export const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { 
    members, 
    workoutLevels, 
    enquiries, 
    complaints, 
    trainers, 
    chartData, 
    updateMasterWorkoutLevel,
    updateComplaintStatus,
    updateMemberWorkoutLevel
  } = useGym();

  // Master workouts edit states
  const [editingLevel, setEditingLevel] = useState(null);
  const [editExercises, setEditExercises] = useState([]);

  // Active user details updates
  const [selectedMember, setSelectedMember] = useState(null);

  const COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

  const handleEditWorkout = (levelId, defaultExercises) => {
    setEditingLevel(levelId);
    setEditExercises([...defaultExercises]);
  };

  const handleSaveWorkout = (levelId) => {
    updateMasterWorkoutLevel(levelId, editExercises);
    setEditingLevel(null);
  };

  const handleRemoveMasterExercise = (id) => {
    setEditExercises(editExercises.filter(ex => ex.id !== id));
  };

  const handleAddMasterExercise = () => {
    const defaultEx = {
      id: `m_ex_${Date.now()}`,
      name: "New Exercise",
      sets: 3,
      reps: 12,
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=60"
    };
    setEditExercises([...editExercises, defaultEx]);
  };

  const handleUpdateExerciseField = (id, field, value) => {
    setEditExercises(editExercises.map(ex => {
      if (ex.id === id) {
        return { ...ex, [field]: value };
      }
      return ex;
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8">
            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Active Members" 
                value={members.length} 
                change="+12% this month" 
                changeType="up"
                icon={FiUsers}
              />
              <StatCard 
                title="Today's Check-ins" 
                value="28" 
                change="+5 vs yesterday" 
                changeType="up"
                icon={FiActivity}
              />
              <StatCard 
                title="Monthly Revenue" 
                value={`₹5,95,000`} 
                change="+8.4% YoY" 
                changeType="up"
                icon={FiDollarSign}
              />
              <StatCard 
                title="Pending Complaints" 
                value={complaints.filter(c => c.status !== "Resolved").length} 
                change="-2 from last week" 
                changeType="down"
                icon={FiAlertCircle}
              />
            </div>

            {/* Grid of Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Membership Growth Chart */}
              <Card className="p-5">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Membership Growth</h3>
                    <p className="text-xs text-slate-500">Overview of basic vs premium subscriptions</p>
                  </div>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.membershipGrowth}>
                      <defs>
                        <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorBasic" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#24304f" opacity={0.3} />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#161d30', border: '1px solid #24304f', borderRadius: '12px' }} labelStyle={{ color: '#fff', fontWeight: 'bold' }} />
                      <Legend verticalAlign="top" height={36} iconType="circle" />
                      <Area type="monotone" dataKey="Premium" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPremium)" />
                      <Area type="monotone" dataKey="Basic" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBasic)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Attendance Peak Hours Bar Chart */}
              <Card className="p-5">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Peak Hour Traffic</h3>
                    <p className="text-xs text-slate-500">Hourly member check-ins comparison</p>
                  </div>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.peakHours}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#24304f" opacity={0.3} />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#161d30', border: '1px solid #24304f', borderRadius: '12px' }} />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
                        {chartData.peakHours.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 1 || index === 6 ? '#8b5cf6' : '#312e81'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Revenue Split Pie Chart */}
              <Card className="p-5">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Revenue Breakdown</h3>
                    <p className="text-xs text-slate-500">Quarterly earnings segmentation by channel</p>
                  </div>
                </div>
                <div className="h-72 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.revenueSplit}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.revenueSplit.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#161d30', border: '1px solid #24304f', borderRadius: '12px' }} formatter={(val) => `₹${val}`} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Weekly Attendance Trend Line Chart */}
              <Card className="p-5">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Attendance Rate</h3>
                    <p className="text-xs text-slate-500">Daily attendance trends for current week</p>
                  </div>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.attendanceTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#24304f" opacity={0.3} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#161d30', border: '1px solid #24304f', borderRadius: '12px' }} />
                      <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} activeDot={{ r: 8 }} dot={{ stroke: '#8b5cf6', strokeWidth: 2, r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>
        );

      case "members":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Members Database</h2>
                <p className="text-xs text-slate-500">List of gym subscriptions and current programs</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((m) => (
                <Card key={m.id} className="p-5 flex flex-col justify-between border-slate-900 bg-slate-900/40">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar src={m.photo} name={m.name} size="md" />
                      <div>
                        <h3 className="text-sm font-bold text-white leading-tight">{m.name}</h3>
                        <p className="text-xs text-slate-500">{m.email}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950/60 rounded-xl space-y-1.5 text-xs text-slate-400">
                      <div className="flex justify-between">
                        <span>Membership:</span>
                        <strong className="text-slate-200">{m.membership.type}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Expiry Date:</span>
                        <strong className="text-slate-200">{m.membership.endDate}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Level:</span>
                        <strong className="text-violet-400">{m.workoutLevel}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-950 flex gap-2 justify-end">
                    <select
                      value={m.workoutLevel}
                      onChange={(e) => updateMemberWorkoutLevel(m.id, e.target.value)}
                      className="bg-slate-950 border border-slate-850 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="Workout 1">Workout 1 (Beginner)</option>
                      <option value="Workout 2">Workout 2 (Novice)</option>
                      <option value="Workout 3">Workout 3 (Intermediate)</option>
                      <option value="Workout 4">Workout 4 (Advanced-Int)</option>
                      <option value="Workout 5">Workout 5 (Advanced)</option>
                      <option value="Workout 6">Workout 6 (Elite)</option>
                    </select>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case "trainers":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Trainer Roster</h2>
              <p className="text-xs text-slate-500">Coach performance rating metrics and duty allocations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trainers.map((t) => (
                <Card key={t.id} className="p-5 text-center bg-slate-900/40 border-slate-900">
                  <Avatar src={t.photo} name={t.name} size="lg" className="mx-auto" />
                  <h3 className="text-base font-bold text-white mt-3">{t.name}</h3>
                  <div className="flex items-center justify-center gap-1 mt-1 text-xs text-amber-400 font-bold">
                    <span>{t.rating} ⭐</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-950 text-center text-xs text-slate-400">
                    <div>
                      <span>Clients</span>
                      <p className="font-bold text-white text-sm mt-0.5">{t.activeMembers}</p>
                    </div>
                    <div>
                      <span>PT Checks</span>
                      <p className="font-bold text-white text-sm mt-0.5">{t.checkIns} logs</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case "sales":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Sales Pipeline Leads</h2>
              <p className="text-xs text-slate-500">Prospect captures logged from Instagram, website and front desk walk-ins</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {enquiries.map((enq) => (
                <Card key={enq.id} className="p-4 flex flex-col justify-between bg-slate-900/40 border-slate-900">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-white">{enq.name}</h4>
                      <Badge variant={enq.status === "Joined" ? "success" : "neutral"}>
                        {enq.status}
                      </Badge>
                    </div>
                    <div className="p-3 bg-slate-950/60 rounded-xl text-[11px] text-slate-400 space-y-1">
                      <div>Goal: <strong className="text-slate-200">{enq.goal}</strong></div>
                      <div>Source: <strong className="text-slate-200">{enq.source}</strong></div>
                      <div>Follow-Up: <strong className="text-slate-200">{enq.followUpDate}</strong></div>
                      <div>Occupation: <strong className="text-slate-200">{enq.occupation}</strong></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case "workouts":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Master Workout Level Schedules</h2>
              <p className="text-xs text-slate-500">Configure default exercises inside the single Gym Workout Program</p>
            </div>

            <div className="space-y-4">
              {Object.entries(workoutLevels).map(([levelId, levelData]) => {
                const isEditing = editingLevel === levelId;
                const activeList = isEditing ? editExercises : levelData.exercises;

                return (
                  <Accordion 
                    key={levelId} 
                    title={levelData.name} 
                    badge={<Badge variant="primary">{levelData.exercises.length} Exercises</Badge>}
                  >
                    <p className="text-xs text-slate-400 mb-4">{levelData.description}</p>
                    
                    {/* Exercise List */}
                    <div className="space-y-3">
                      {activeList.map((ex, idx) => (
                        <div key={ex.id || idx} className="p-4 bg-slate-950/80 border border-slate-900 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 font-bold font-mono">#{idx+1}</span>
                            {isEditing ? (
                              <input 
                                type="text" 
                                value={ex.name} 
                                onChange={(e) => handleUpdateExerciseField(ex.id, "name", e.target.value)} 
                                className="bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white focus:outline-none w-48"
                              />
                            ) : (
                              <strong className="text-xs text-white">{ex.name}</strong>
                            )}
                          </div>

                          <div className="flex gap-4 items-center text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-500">Sets:</span>
                              {isEditing ? (
                                <input 
                                  type="number" 
                                  value={ex.sets} 
                                  onChange={(e) => handleUpdateExerciseField(ex.id, "sets", parseInt(e.target.value) || 0)} 
                                  className="bg-slate-900 border border-slate-800 rounded-lg p-1 w-12 text-center text-white"
                                />
                              ) : (
                                <strong className="text-slate-200">{ex.sets}</strong>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-500">Reps:</span>
                              {isEditing ? (
                                <input 
                                  type="number" 
                                  value={ex.reps} 
                                  onChange={(e) => handleUpdateExerciseField(ex.id, "reps", parseInt(e.target.value) || 0)} 
                                  className="bg-slate-900 border border-slate-800 rounded-lg p-1 w-12 text-center text-white"
                                />
                              ) : (
                                <strong className="text-slate-200">{ex.reps}</strong>
                              )}
                            </div>

                            {isEditing && (
                              <button 
                                onClick={() => handleRemoveMasterExercise(ex.id)}
                                className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-450 border border-rose-500/20 rounded-lg transition-colors ml-2"
                              >
                                <FiTrash2 className="w-3.5 h-3.5 text-rose-400" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-5 pt-4 border-t border-slate-900 flex justify-end gap-2">
                      {isEditing ? (
                        <>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => handleAddMasterExercise()}
                            className="text-xs"
                          >
                            <FiPlus className="w-4 h-4 mr-1" /> Add exercise
                          </Button>
                          <Button 
                            variant="success" 
                            size="sm" 
                            onClick={() => handleSaveWorkout(levelId)}
                            className="text-xs"
                          >
                            <FiSave className="w-4 h-4 mr-1" /> Save master schedule
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditWorkout(levelId, levelData.exercises)}
                          className="text-xs border-violet-500/20"
                        >
                          Modify Exercises
                        </Button>
                      )}
                    </div>
                  </Accordion>
                );
              })}
            </div>
          </div>
        );

      case "attendance":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Daily Attendance Registers</h2>
              <p className="text-xs text-slate-500">Verify entry/exit logs of gym members checked in today</p>
            </div>

            <Card className="p-0 overflow-hidden bg-slate-900/40 border-slate-900">
              <div className="px-6 py-4 border-b border-slate-950 font-bold text-xs text-slate-400 uppercase tracking-wider grid grid-cols-4">
                <span>Member</span>
                <span>Level</span>
                <span>Check In</span>
                <span>Check Out</span>
              </div>
              <div className="divide-y divide-slate-950">
                {members.flatMap(m => m.attendance.map(a => ({ name: m.name, level: m.workoutLevel, ...a }))).map((log, idx) => (
                  <div key={idx} className="px-6 py-4 grid grid-cols-4 text-xs items-center hover:bg-slate-900/20">
                    <span className="font-semibold text-white">{log.name}</span>
                    <span className="text-violet-400">{log.level}</span>
                    <span className="text-slate-300 font-mono">{log.checkIn || "Absent"}</span>
                    <span className="text-slate-500 font-mono">{log.checkOut || "--"}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case "complaints":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Complaints & Feedback Log</h2>
              <p className="text-xs text-slate-500">Service desk ticket classifications logged from support panel</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {complaints.map((comp) => (
                <Card key={comp.id} className="p-5 flex flex-col justify-between bg-slate-900/40 border-slate-900 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">{comp.date}</span>
                      <Badge variant={
                        comp.status === "Resolved" ? "success" : 
                        comp.status === "In Progress" ? "warning" : "danger"
                      }>
                        {comp.status}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-bold text-white">{comp.category} Query from {comp.memberName}</h3>
                    <p className="text-xs text-slate-400 italic bg-slate-950/60 p-3 rounded-xl">
                      "{comp.description}"
                    </p>
                  </div>

                  {comp.status !== "Resolved" && (
                    <div className="pt-2 border-t border-slate-950 flex justify-end gap-2">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => updateComplaintStatus(comp.id, "In Progress")}
                        className="text-[10px] py-1.5"
                      >
                        Progress Ticket
                      </Button>
                      <Button 
                        variant="success" 
                        size="sm" 
                        onClick={() => updateComplaintStatus(comp.id, "Resolved")}
                        className="text-[10px] py-1.5"
                      >
                        <FiCheck className="w-3.5 h-3.5 mr-1" /> Mark Resolved
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        );

      case "fitness":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Digital Fitness Evaluations</h2>
              <p className="text-xs text-slate-500">Latest evaluations processed by active coaches</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {members.map((m) => (
                <Card key={m.id} className="p-5 bg-slate-900/40 border-slate-900 space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-950 pb-3">
                    <Avatar src={m.photo} name={m.name} size="sm" />
                    <div>
                      <h3 className="text-xs font-bold text-white">{m.name}</h3>
                      <p className="text-[10px] text-slate-500">Last Test: {m.fitnessTestHistory[m.fitnessTestHistory.length - 1]?.date || "None"}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {m.fitnessTestHistory.map((h, i) => (
                      <div key={i} className="flex justify-between items-center text-xs p-2 bg-slate-950/50 rounded-xl">
                        <span className="text-slate-400 font-bold">{h.date}</span>
                        <div className="flex gap-4 text-slate-350">
                          <span>BF: <strong>{h.general.bodyFat}%</strong></span>
                          <span>Wt: <strong>{h.general.weight}kg</strong></span>
                          <span>Bench: <strong>{h.strength.benchPress}kg</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="p-12 text-center text-slate-500 text-xs">
            Admin customization feature panel placeholder.
          </div>
        );
    }
  };

  return (
    <SidebarLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </SidebarLayout>
  );
};
