import React, { useState } from "react";
import { useGym } from "../../hooks/useGym";
import { MobileLayout } from "../../layouts/MobileLayout";
import { Card, Badge, Avatar, Button, SearchBar, Modal } from "../../components/UI";
import { 
  FiCamera, FiActivity, FiUsers, FiTrendingUp, 
  FiCheckCircle, FiTrash2, FiPlus, FiAlertTriangle, 
  FiClipboard, FiChevronRight, FiCheck, FiHeart 
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export const TrainerPortal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { 
    members, 
    workoutLevels, 
    updateWorkoutAdjustment, 
    addFitnessTest,
    logPTSession,
    todaysProgress,
    updateExerciseProgress,
    notifications
  } = useGym();

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  // Modal / Form States
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showFitnessTestModal, setShowFitnessTestModal] = useState(false);
  const [showPTModal, setShowPTModal] = useState(false);

  // Scanner Simulator States
  const [scanMessage, setScanMessage] = useState("");

  // Temporary Workout Adjustment working copy
  const [tempExercises, setTempExercises] = useState([]);
  const [tempReason, setTempReason] = useState("Trainer Decision");

  // Fitness Test Form state
  const [height, setHeight] = useState("178");
  const [weight, setWeight] = useState("80");
  const [bodyFat, setBodyFat] = useState("20");
  const [muscleMass, setMuscleMass] = useState("60");
  const [chest, setChest] = useState("105");
  const [waist, setWaist] = useState("88");
  const [biceps, setBiceps] = useState("37");
  const [benchPress, setBenchPress] = useState("80");
  const [latPulldown, setLatPulldown] = useState("70");
  const [legPress, setLegPress] = useState("200");
  const [sitAndReach, setSitAndReach] = useState("15");

  // PT session state
  const [ptNotes, setPtNotes] = useState("");

  // Filtered members list
  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Initialize Temporary Adjustment Modal data
  const handleOpenAdjustment = (member) => {
    const activeLevelEx = workoutLevels[member.workoutLevel]?.exercises || [];
    // Load current adjustment exercises if they exist, else load master level exercises
    const currentList = member.todaysWorkoutAdjustment 
      ? [...member.todaysWorkoutAdjustment.exercises] 
      : [...activeLevelEx];
    
    setTempExercises(currentList);
    setTempReason(member.todaysWorkoutAdjustment?.reason || "Trainer Decision");
    setShowAdjustmentModal(true);
  };

  const handleSaveAdjustment = () => {
    updateWorkoutAdjustment(selectedMember.id, {
      exercises: tempExercises,
      reason: tempReason
    });
    setShowAdjustmentModal(false);
    // Refresh selected member profile reference
    const updated = members.find(m => m.id === selectedMember.id);
    setSelectedMember(updated);
  };

  const handleRemoveExercise = (id) => {
    setTempExercises(tempExercises.filter(ex => ex.id !== id));
  };

  const handleAddExercise = () => {
    const randomExs = [
      { id: `custom_${Date.now()}_1`, name: "Bicep Curls (Dumbbell)", sets: 3, reps: 12, image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=60" },
      { id: `custom_${Date.now()}_2`, name: "Tricep Pushdowns", sets: 3, reps: 15, image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=500&auto=format&fit=crop&q=60" },
      { id: `custom_${Date.now()}_3`, name: "Leg Extensions", sets: 3, reps: 15, image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&auto=format&fit=crop&q=60" },
      { id: `custom_${Date.now()}_4`, name: "Hammer Curls", sets: 3, reps: 12, image: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=500&auto=format&fit=crop&q=60" }
    ];
    // pick one random exercise to add
    const pick = randomExs[Math.floor(Math.random() * randomExs.length)];
    setTempExercises([...tempExercises, pick]);
  };

  // Submit Fitness Test Form
  const handleSubmitFitnessTest = (e) => {
    e.preventDefault();
    const hNum = parseFloat(height) / 100; // in meters
    const wNum = parseFloat(weight);
    const calculatedBmi = (wNum / (hNum * hNum)).toFixed(1);
    const bmrValue = Math.round(10 * wNum + 6.25 * parseFloat(height) - 5 * 28 + 5); // Harris-Benedict approximation for male 28yo

    const newRecord = {
      date: new Date().toISOString().split("T")[0],
      general: {
        height: parseFloat(height),
        weight: wNum,
        bmi: parseFloat(calculatedBmi),
        bodyFat: parseFloat(bodyFat),
        muscleMass: parseFloat(muscleMass),
        bmr: bmrValue,
        visceralFat: 7
      },
      measurements: {
        neck: 38,
        chest: parseFloat(chest),
        waist: parseFloat(waist),
        hips: 100,
        thigh: 58,
        biceps: parseFloat(biceps),
        forearm: 29,
        calf: 38,
        shoulder: 120
      },
      strength: {
        benchPress: parseFloat(benchPress),
        latPulldown: parseFloat(latPulldown),
        legPress: parseFloat(legPress),
        sitAndReach: parseFloat(sitAndReach)
      },
      cardio: {
        vo2Max: 42,
        restingHR: 68
      }
    };

    addFitnessTest(selectedMember.id, newRecord);
    setShowFitnessTestModal(false);
    
    // Refresh selected member profile reference
    setTimeout(() => {
      const updated = members.find(m => m.id === selectedMember.id);
      setSelectedMember(updated);
    }, 100);
  };

  // Log PT Session
  const handleLogPTSessionSubmit = (e) => {
    e.preventDefault();
    if (!ptNotes) return;

    logPTSession(selectedMember.id, {
      date: new Date().toISOString().split("T")[0],
      checkIn: "09:00 AM",
      checkOut: "10:00 AM",
      notes: ptNotes,
      memberSig: selectedMember.name.split(" ")[0] + " S.",
      trainerSig: "Coach Vikram"
    });

    setPtNotes("");
    setShowPTModal(false);

    // Refresh selected member profile reference
    setTimeout(() => {
      const updated = members.find(m => m.id === selectedMember.id);
      setSelectedMember(updated);
    }, 100);
  };

  // Simulating check in scanning
  const simulateCheckIn = (member) => {
    setScanMessage(`Checking in: ${member.name}...`);
    setTimeout(() => {
      setScanMessage(`Success! ${member.name} check-in registered at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    }, 1200);
  };

  const renderContent = () => {
    if (selectedMember) {
      // Member Detail Console View
      const member = selectedMember;
      const isAdjusted = !!member.todaysWorkoutAdjustment;
      const activeExercises = isAdjusted 
        ? member.todaysWorkoutAdjustment.exercises 
        : (workoutLevels[member.workoutLevel]?.exercises || []);

      return (
        <div className="space-y-6 pb-6">
          {/* Back Action */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSelectedMember(null)}
              className="text-xs font-bold text-violet-400 hover:underline flex items-center gap-1"
            >
              &larr; Back to Member Search
            </button>
          </div>

          {/* Member Card Summary */}
          <Card className="p-4 bg-slate-900/60 flex items-center gap-4">
            <Avatar src={member.photo} name={member.name} size="lg" />
            <div className="flex-1">
              <h3 className="text-base font-bold text-white leading-tight">{member.name}</h3>
              <p className="text-xs text-slate-400 mt-1">Goal level: <strong className="text-violet-400">{member.workoutLevel}</strong></p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="primary">{member.membership.type}</Badge>
                <Badge variant={member.membership.status === "Active" ? "success" : "danger"}>
                  {member.membership.status}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Action Blocks */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={() => handleOpenAdjustment(member)}
              className="flex flex-col py-4 px-2 items-center text-center gap-1.5 border-amber-500/20 hover:border-amber-500/60 hover:bg-amber-500/5"
            >
              <FiActivity className="w-5 h-5 text-amber-400" />
              <span className="text-xs text-amber-400 font-bold">Temporary Adjustment</span>
            </Button>

            <Button 
              variant="outline" 
              onClick={() => setShowFitnessTestModal(true)}
              className="flex flex-col py-4 px-2 items-center text-center gap-1.5 border-violet-500/20 hover:border-violet-500/60 hover:bg-violet-500/5"
            >
              <FiClipboard className="w-5 h-5 text-violet-400" />
              <span className="text-xs text-violet-400 font-bold">Fitness Test</span>
            </Button>

            {member.ptPackage && (
              <Button 
                variant="outline" 
                onClick={() => setShowPTModal(true)}
                className="col-span-2 flex py-3 items-center justify-center gap-2 border-emerald-500/20 hover:border-emerald-500/60 hover:bg-emerald-500/5 text-emerald-400"
              >
                <FiCheckCircle className="w-5 h-5" />
                <span className="text-xs font-bold">Verify Personal Training Session</span>
              </Button>
            )}
          </div>

          {/* Today's Workout Tracker */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Today's Workout Logging</h4>
              {isAdjusted && <Badge variant="warning">Adjusted</Badge>}
            </div>

            <div className="space-y-3">
              {activeExercises.map((ex) => {
                const prog = todaysProgress[member.id]?.[ex.id] || { weight: "", reps: "", completed: false };
                return (
                  <Card key={ex.id} className="p-4 bg-slate-900/40 border-slate-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-white">{ex.name}</h4>
                        <span className="text-[10px] text-slate-500">Targets: {ex.sets} Sets &bull; {ex.reps} Reps</span>
                      </div>
                      
                      <button
                        onClick={() => updateExerciseProgress(member.id, ex.id, prog.weight, prog.reps, !prog.completed)}
                        className={`p-2 rounded-xl transition-all border ${
                          prog.completed 
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" 
                            : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-400"
                        }`}
                      >
                        <FiCheck className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Weight and reps controls */}
                    <div className="grid grid-cols-2 gap-3 mt-3.5 pt-3 border-t border-slate-950">
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 block uppercase">Weight (kg)</label>
                        <input
                          type="number"
                          placeholder="e.g. 60"
                          value={prog.weight}
                          onChange={(e) => updateExerciseProgress(member.id, ex.id, e.target.value, prog.reps, prog.completed)}
                          className="w-full mt-1 bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-lg p-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 block uppercase">Completed Reps</label>
                        <input
                          type="number"
                          placeholder="e.g. 10"
                          value={prog.reps}
                          onChange={(e) => updateExerciseProgress(member.id, ex.id, prog.weight, e.target.value, prog.completed)}
                          className="w-full mt-1 bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-lg p-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Fitness Test Metrics history graph view */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider px-1">Fitness Test History Summary</h4>
            <div className="space-y-2.5">
              {member.fitnessTestHistory.map((h, i) => (
                <Card key={i} className="p-4 bg-slate-900/30 border-slate-850">
                  <div className="flex justify-between items-center text-xs border-b border-slate-950 pb-2 mb-2">
                    <span className="font-bold text-white">{h.date}</span>
                    <Badge variant="success">Body Fat: {h.general.bodyFat}%</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400">
                    <div>Weight: <strong className="text-slate-200">{h.general.weight}kg</strong></div>
                    <div>BMI: <strong className="text-slate-200">{h.general.bmi}</strong></div>
                    <div>BMR: <strong className="text-slate-200">{h.general.bmr}</strong></div>
                    <div>Waist: <strong className="text-slate-200">{h.measurements.waist}cm</strong></div>
                    <div>Bench: <strong className="text-slate-200">{h.strength.benchPress}kg</strong></div>
                    <div>VO2 Max: <strong className="text-slate-200">{h.cardio.vo2Max}</strong></div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* 1. Temporary Adjustment Modal */}
          <Modal 
            isOpen={showAdjustmentModal} 
            onClose={() => setShowAdjustmentModal(false)}
            title="Today's Temporary Workout Modification"
          >
            <div className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex gap-2 items-start">
                <FiAlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed font-semibold">
                  <strong>Warning:</strong> This adjustment targets today's workout only. Changes expire automatically tomorrow morning.
                </p>
              </div>

              {/* Exercises loop */}
              <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar">
                {tempExercises.map((ex) => (
                  <div key={ex.id} className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-white">{ex.name}</h4>
                      <span className="text-[10px] text-slate-500">{ex.sets} Sets x {ex.reps} Reps</span>
                    </div>
                    <button 
                      onClick={() => handleRemoveExercise(ex.id)}
                      className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors border border-rose-500/20"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={handleAddExercise}
                  className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1"
                >
                  <FiPlus className="w-4 h-4" /> Add Exercise Variation
                </button>
              </div>

              {/* Adjust Reason */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Reason for temporary edit</label>
                <select
                  value={tempReason}
                  onChange={(e) => setTempReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="Injury">Injury Adjustment</option>
                  <option value="Equipment Busy">Equipment Occupied</option>
                  <option value="Trainer Decision">Coach Prescribed Progression</option>
                  <option value="Other">Other Category Override</option>
                </select>
              </div>

              <Button onClick={handleSaveAdjustment} className="w-full">Save Changes Today</Button>
            </div>
          </Modal>

          {/* 2. Fitness Test Digital Form Modal */}
          <Modal 
            isOpen={showFitnessTestModal} 
            onClose={() => setShowFitnessTestModal(false)}
            title="Digital Fitness Test Record Form"
          >
            <form onSubmit={handleSubmitFitnessTest} className="space-y-5">
              <span className="text-[10px] text-violet-400 uppercase tracking-widest font-bold">1. General Metrics Vitals</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] text-slate-500 block font-bold uppercase">Height (cm)</label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="text-[9px] text-slate-500 block font-bold uppercase">Weight (kg)</label>
                  <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="text-[9px] text-slate-500 block font-bold uppercase">Body Fat %</label>
                  <input type="number" value={bodyFat} onChange={(e) => setBodyFat(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="text-[9px] text-slate-500 block font-bold uppercase">Muscle Mass (kg)</label>
                  <input type="number" value={muscleMass} onChange={(e) => setMuscleMass(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-violet-500" />
                </div>
              </div>

              <span className="text-[10px] text-violet-400 uppercase tracking-widest font-bold block pt-2 border-t border-slate-900">2. Tape Measurements (cm)</span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[9px] text-slate-550 block uppercase">Chest</label>
                  <input type="number" value={chest} onChange={(e) => setChest(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="text-[9px] text-slate-555 block uppercase">Waist</label>
                  <input type="number" value={waist} onChange={(e) => setWaist(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="text-[9px] text-slate-555 block uppercase">Biceps</label>
                  <input type="number" value={biceps} onChange={(e) => setBiceps(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-violet-500" />
                </div>
              </div>

              <span className="text-[10px] text-violet-400 uppercase tracking-widest font-bold block pt-2 border-t border-slate-900">3. Strength & Flex tests</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] text-slate-555 block uppercase">Bench Press 1RM (kg)</label>
                  <input type="number" value={benchPress} onChange={(e) => setBenchPress(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs text-white focus:outline-none" />
                </div>
                <div>
                  <label className="text-[9px] text-slate-555 block uppercase">Lat Pulldown 1RM (kg)</label>
                  <input type="number" value={latPulldown} onChange={(e) => setLatPulldown(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs text-white focus:outline-none" />
                </div>
                <div>
                  <label className="text-[9px] text-slate-555 block uppercase">Leg Press 1RM (kg)</label>
                  <input type="number" value={legPress} onChange={(e) => setLegPress(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs text-white focus:outline-none" />
                </div>
                <div>
                  <label className="text-[9px] text-slate-555 block uppercase">Sit & Reach (cm)</label>
                  <input type="number" value={sitAndReach} onChange={(e) => setSitAndReach(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs text-white focus:outline-none" />
                </div>
              </div>

              <Button type="submit" className="w-full py-3">Commit Metric Evaluation</Button>
            </form>
          </Modal>

          {/* 3. PT session Modal */}
          <Modal 
            isOpen={showPTModal} 
            onClose={() => setShowPTModal(false)}
            title="Log Personal Training Session"
          >
            <form onSubmit={handleLogPTSessionSubmit} className="space-y-4">
              <p className="text-xs text-slate-400">
                Log a trainer-supervised check-in for <strong className="text-white">{member.name}</strong>. This deducts 1 session from their package instantly.
              </p>
              <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl space-y-1 text-xs">
                <div>Package: <strong className="text-white">{member.ptPackage?.package}</strong></div>
                <div>Remaining Sessions: <strong className="text-violet-400">{member.ptPackage?.remaining}</strong></div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Workout Session Notes</label>
                <textarea
                  required
                  rows={3}
                  value={ptNotes}
                  onChange={(e) => setPtNotes(e.target.value)}
                  placeholder="Focus areas, lift increments, posture fixes..."
                  className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white resize-none focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="border border-dashed border-slate-800 p-2.5 rounded-xl text-center bg-slate-950">
                  <span className="text-[8px] text-slate-500 block uppercase">Member Initials</span>
                  <div className="h-8 flex items-center justify-center font-mono italic text-xs text-slate-300">
                    {member.name.split(" ")[0]} S.
                  </div>
                </div>
                <div className="border border-dashed border-slate-800 p-2.5 rounded-xl text-center bg-slate-950">
                  <span className="text-[8px] text-slate-500 block uppercase">Coach Signature</span>
                  <div className="h-8 flex items-center justify-center font-mono italic text-xs text-violet-400">
                    Coach Vikram
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full py-2.5">Sign & Verify Check-in</Button>
            </form>
          </Modal>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Vitals overview */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-3 text-center">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Check-ins</span>
                <h3 className="text-xl font-bold text-emerald-400 mt-1">28</h3>
                <span className="text-[8px] text-slate-500 block">Today's tally</span>
              </Card>

              <Card className="p-3 text-center">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Duty List</span>
                <h3 className="text-xl font-bold text-violet-400 mt-1">8</h3>
                <span className="text-[8px] text-slate-500 block">Members assigned</span>
              </Card>

              <Card className="p-3 text-center">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Test Audits</span>
                <h3 className="text-xl font-bold text-amber-400 mt-1">3</h3>
                <span className="text-[8px] text-slate-500 block">Pending test</span>
              </Card>
            </div>

            {/* Quick action triggers */}
            <Card className="p-4 space-y-3 bg-gradient-to-r from-slate-900 via-violet-950/10 to-slate-900">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Quick Workflows</h4>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => {
                    setActiveTab("scanner");
                    setScanMessage("Ready to receive QR check-in scan signal...");
                  }} 
                  className="p-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-xl text-center transition-all text-slate-300 hover:text-white"
                >
                  <FiCamera className="w-5 h-5 mx-auto mb-1 text-violet-400" />
                  <span className="text-[9px] font-bold block">Access Camera</span>
                </button>

                <button 
                  onClick={() => {
                    setActiveTab("members");
                    setSearchQuery("");
                  }} 
                  className="p-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-xl text-center transition-all text-slate-300 hover:text-white"
                >
                  <FiUsers className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                  <span className="text-[9px] font-bold block">Directory</span>
                </button>

                <button 
                  onClick={() => {
                    // Quick select Rahul
                    setSelectedMember(members[0]);
                  }} 
                  className="p-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-xl text-center transition-all text-slate-300 hover:text-white"
                >
                  <FiActivity className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                  <span className="text-[9px] font-bold block">Quick Edit Rahul</span>
                </button>
              </div>
            </Card>

            {/* Recent Checkins */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider px-1">Active Checked-in Members</h3>
              <div className="space-y-2.5">
                {members.filter(m => m.attendance.some(a => a.date === "2026-06-29")).map((m) => (
                  <Card 
                    key={m.id} 
                    hover 
                    onClick={() => setSelectedMember(m)}
                    className="flex justify-between items-center p-3.5 cursor-pointer bg-slate-900/60"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar src={m.photo} name={m.name} size="sm" />
                      <div>
                        <h4 className="text-xs font-bold text-white">{m.name}</h4>
                        <span className="text-[9px] text-slate-400">Level: <strong className="text-violet-400">{m.workoutLevel}</strong></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">IN GYM</Badge>
                      <FiChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case "scanner":
        return (
          <div className="space-y-6">
            <div className="border-b border-slate-900 pb-3">
              <h3 className="text-base font-bold text-white">QR Scanning Chamber</h3>
              <p className="text-xs text-slate-400">Log client check-ins via digital card simulator</p>
            </div>

            {/* Camera Viewfinder mockup */}
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-6 shadow-inner">
              {/* Scanning visual overlay */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent shadow-[0_0_12px_rgba(139,92,246,0.8)] animate-pulse" style={{ animationDuration: '1.5s', animationIterationCount: 'infinite' }} />

              <div className="border-2 border-dashed border-violet-500/20 w-48 h-48 rounded-2xl flex flex-col items-center justify-center text-center p-4">
                <FiCamera className="w-8 h-8 text-violet-500/40 mb-2 animate-bounce" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Awaiting optical target</span>
              </div>
            </div>

            {scanMessage && (
              <div className="p-3 bg-violet-950/40 border border-violet-500/30 text-violet-400 text-xs font-bold rounded-2xl text-center">
                {scanMessage}
              </div>
            )}

            {/* Quick check-in bypass buttons */}
            <Card className="p-4 space-y-3 bg-slate-900/60 border-slate-850">
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wide">Test QR Check-in Simulator</span>
              <p className="text-[10px] text-slate-550 leading-relaxed">
                Click any member below to simulate their QR barcode being flashed in front of the optical reader:
              </p>
              
              <div className="space-y-2">
                {members.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => simulateCheckIn(m)}
                    className="w-full p-2 text-left bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-850 rounded-xl transition-all flex items-center gap-3 text-slate-300 hover:text-white"
                  >
                    <Avatar src={m.photo} name={m.name} size="sm" />
                    <div className="flex-1">
                      <h4 className="text-xs font-bold leading-none">{m.name}</h4>
                      <span className="text-[9px] text-slate-500 mt-0.5 block">Level: {m.workoutLevel}</span>
                    </div>
                    <span className="text-[9px] bg-violet-500/10 text-violet-400 font-bold border border-violet-500/20 px-2 py-0.5 rounded-md uppercase">Scan</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        );

      case "members":
        return (
          <div className="space-y-5">
            <div className="border-b border-slate-900 pb-3">
              <h3 className="text-base font-bold text-white">Member Directory</h3>
              <p className="text-xs text-slate-400">Search members to log workouts or adjust lists</p>
            </div>

            <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

            {/* Members List */}
            <div className="space-y-2.5">
              {filteredMembers.map((m) => (
                <Card
                  key={m.id}
                  hover
                  onClick={() => setSelectedMember(m)}
                  className="p-3 bg-slate-900/60 border-slate-800 cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Avatar src={m.photo} name={m.name} size="sm" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{m.name}</h4>
                      <span className="text-[9px] text-slate-400">Workout: <strong className="text-violet-400">{m.workoutLevel}</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={m.membership.status === "Active" ? "success" : "danger"}>
                      {m.membership.status}
                    </Badge>
                    <FiChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </Card>
              ))}

              {filteredMembers.length === 0 && (
                <div className="text-center py-12">
                  <FiUsers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-xs text-slate-400">No members match your filter query.</p>
                </div>
              )}
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <div className="text-center py-2">
              <Avatar name="Coach Vikram" size="xl" className="mx-auto" />
              <h3 className="text-lg font-bold text-white mt-3">Coach Vikram</h3>
              <p className="text-xs text-slate-400 font-medium">Senior Strength & Conditioning Specialist</p>
              
              <div className="mt-3 inline-flex items-center gap-2">
                <Badge variant="primary">Rating: 4.8 ⭐</Badge>
                <Badge variant="success">Active Shift: Morning</Badge>
              </div>
            </div>

            <Card className="p-4 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Trainer Statistics</h4>
                <Badge variant="neutral">Weekly Tally</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
                  <span className="text-[9px] text-slate-500 block uppercase font-bold">Assigned Members</span>
                  <strong className="text-base text-white mt-1 block">8 Active</strong>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
                  <span className="text-[9px] text-slate-500 block uppercase font-bold">Completed PT Logs</span>
                  <strong className="text-base text-violet-400 mt-1 block">42 Sessions</strong>
                </div>
              </div>
            </Card>

            <Card className="p-4 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Coach Shift Rules</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                As a trainer, remember to log your client's PT sessions and update their daily progress. 
                Any **Temporary Adjustments** to customer workout schedules will reset automatically tomorrow.
              </p>
            </Card>
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
