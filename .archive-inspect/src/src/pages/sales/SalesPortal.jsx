import React, { useState } from "react";
import { useGym } from "../../hooks/useGym";
import { MobileLayout } from "../../layouts/MobileLayout";
import { Card, Badge, Avatar, Button, Modal } from "../../components/UI";
import { 
  FiTrendingUp, FiPhone, FiMessageCircle, FiPlus, 
  FiInbox, FiCalendar, FiUser, FiInfo, FiActivity 
} from "react-icons/fi";

export const SalesPortal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { 
    enquiries, 
    addEnquiry, 
    updateEnquiryStatus, 
    members 
  } = useGym();

  // Modal / Form triggers
  const [showEnqModal, setShowEnqModal] = useState(false);

  // Enquiry CRM Form state
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [occupation, setOccupation] = useState("");
  const [goal, setGoal] = useState("Weight Loss");
  const [source, setSource] = useState("Instagram");
  const [preferredTime, setPreferredTime] = useState("Morning");
  const [salesNotes, setSalesNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState("2026-06-30");

  const handleSubmitEnquiry = (e) => {
    e.preventDefault();
    if (!name || !phone) return;

    addEnquiry({
      name,
      age: parseInt(age) || 25,
      gender,
      phone,
      email,
      occupation,
      goal,
      source,
      preferredTime,
      salesNotes,
      followUpDate,
      status: "New"
    });

    // Reset Form
    setName("");
    setAge("");
    setPhone("");
    setEmail("");
    setOccupation("");
    setSalesNotes("");
    setShowEnqModal(false);
  };

  // Quick WhatsApp/Call helper
  const triggerCall = (phoneNum) => {
    window.open(`tel:${phoneNum}`, "_self");
  };

  const triggerWhatsApp = (phoneNum, msg) => {
    window.open(`https://wa.me/${phoneNum.replace(/\s+/g, '')}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // Find absent members
  // Samantha: Absent since 2026-06-22
  // Vikram: Absent since 2026-06-17
  const absentMembers = [
    { name: "Vikram Malhotra", phone: "+91 77665 54433", lastVisit: "2026-06-17", daysAbsent: 12 },
    { name: "Samantha Lopez", phone: "+91 88776 65544", lastVisit: "2026-06-22", daysAbsent: 7 }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* KPI Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Leads Pipeline</span>
                <h3 className="text-2xl font-bold text-white mt-1">{enquiries.length}</h3>
                <span className="text-[8px] text-slate-500 mt-1 block">Active prospects</span>
              </Card>

              <Card className="p-4">
                <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Follow Ups Today</span>
                <h3 className="text-2xl font-bold text-violet-400 mt-1">
                  {enquiries.filter(e => e.status !== "Joined").length}
                </h3>
                <span className="text-[8px] text-slate-500 mt-1 block">Require CRM calls</span>
              </Card>

              <Card className="p-4">
                <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Absentees</span>
                <h3 className="text-2xl font-bold text-rose-400 mt-1">2</h3>
                <span className="text-[8px] text-slate-500 mt-1 block">Absent &gt; 5 days</span>
              </Card>

              <Card className="p-4">
                <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Conversions</span>
                <h3 className="text-2xl font-bold text-emerald-400 mt-1">78%</h3>
                <span className="text-[8px] text-slate-550 mt-1 block">Trial-to-join rate</span>
              </Card>
            </div>

            {/* Quick action bar */}
            <Button 
              onClick={() => setShowEnqModal(true)} 
              className="w-full py-3.5 flex items-center justify-center gap-2"
            >
              <FiPlus className="w-5 h-5" />
              <span>Capture New CRM Lead</span>
            </Button>

            {/* Absent Members Attention Cards */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Absent Members Log</h3>
                <Badge variant="danger">Attention Needed</Badge>
              </div>

              {absentMembers.map((m, i) => (
                <Card key={i} className="p-4 space-y-3 bg-slate-900/60 border-slate-850">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-white">{m.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Last Checked-In: {m.lastVisit}</p>
                    </div>
                    <Badge variant="warning">{m.daysAbsent} Days Absent</Badge>
                  </div>
                  
                  {/* Outreach options */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-950">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => triggerCall(m.phone)}
                      className="text-xs py-2 flex items-center justify-center gap-1.5"
                    >
                      <FiPhone className="w-3.5 h-3.5" /> Call
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => triggerWhatsApp(m.phone, `Hi ${m.name.split(" ")[0]}, we missed you at the gym! Is everything okay? Let us know if you need help with your workout schedule.`)}
                      className="text-xs py-2 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/5 flex items-center justify-center gap-1.5"
                    >
                      <FiMessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case "enquiries":
        return (
          <div className="space-y-5">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Prospects Pipeline</h3>
                <p className="text-xs text-slate-400">Total active leads: {enquiries.length}</p>
              </div>
              <Button onClick={() => setShowEnqModal(true)} size="sm" className="px-3">
                <FiPlus className="w-4 h-4" />
              </Button>
            </div>

            {/* Pipeline List */}
            <div className="space-y-3">
              {enquiries.map((enq) => (
                <Card key={enq.id} className="p-4 bg-slate-900/40 border-slate-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-white">{enq.name} ({enq.age}y/o)</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Goal: <strong className="text-violet-400">{enq.goal}</strong></p>
                    </div>
                    <Badge variant={
                      enq.status === "Joined" ? "success" : 
                      enq.status === "Trial" ? "info" : 
                      enq.status === "Contacted" ? "warning" : "primary"
                    }>
                      {enq.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                    <div>Time preference: <strong className="text-slate-200">{enq.preferredTime}</strong></div>
                    <div>Source: <strong className="text-slate-200">{enq.source}</strong></div>
                    <div>Next follow-up: <strong className="text-slate-200">{enq.followUpDate}</strong></div>
                    <div>Phone: <strong className="text-slate-200">{enq.phone}</strong></div>
                  </div>

                  {enq.salesNotes && (
                    <p className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded-xl italic">
                      "{enq.salesNotes}"
                    </p>
                  )}

                  {/* Actions to move along pipeline */}
                  {enq.status !== "Joined" && (
                    <div className="flex gap-2 justify-end pt-2 border-t border-slate-950">
                      {enq.status === "New" && (
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => updateEnquiryStatus(enq.id, "Contacted")}
                          className="text-[10px] py-1.5"
                        >
                          Mark Contacted
                        </Button>
                      )}
                      {enq.status === "Contacted" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => updateEnquiryStatus(enq.id, "Trial")}
                          className="text-[10px] py-1.5 border-violet-500/20"
                        >
                          Schedule Free Trial
                        </Button>
                      )}
                      {enq.status === "Trial" && (
                        <Button 
                          variant="success" 
                          size="sm" 
                          onClick={() => updateEnquiryStatus(enq.id, "Joined")}
                          className="text-[10px] py-1.5"
                        >
                          Convert to Member (Joined)
                        </Button>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Digital CRM Form Modal */}
            <Modal
              isOpen={showEnqModal}
              onClose={() => setShowEnqModal(false)}
              title="Capture New Enquiry"
            >
              <form onSubmit={handleSubmitEnquiry} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 block uppercase">Prospect Name</label>
                    <input type="text" required placeholder="e.g. Karan" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-violet-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 block uppercase">Age</label>
                    <input type="number" placeholder="e.g. 30" value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-violet-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 block uppercase">Phone Number</label>
                    <input type="tel" required placeholder="e.g. +91 99999 88888" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-xs text-white focus:outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 block uppercase">Email Address</label>
                    <input type="email" placeholder="e.g. name@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-xs text-white focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 block uppercase">Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-xs text-white focus:outline-none">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 block uppercase">Occupation</label>
                    <input type="text" placeholder="e.g. Lawyer" value={occupation} onChange={(e) => setOccupation(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-xs text-white focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 block uppercase">Prospect Goal</label>
                    <select value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2 text-[10px] text-white focus:outline-none">
                      <option value="Weight Loss">Weight Loss</option>
                      <option value="Muscle Gain">Muscle Gain</option>
                      <option value="General Fitness">General Fitness</option>
                      <option value="Medical Issue">Medical Issue</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 block uppercase">Lead Source</label>
                    <select value={source} onChange={(e) => setSource(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2 text-[10px] text-white focus:outline-none">
                      <option value="Instagram">Instagram</option>
                      <option value="Referral">Referral</option>
                      <option value="Walk-in">Walk-in</option>
                      <option value="Website">Website</option>
                      <option value="Friend">Friend</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 block uppercase">Time Pref.</label>
                    <select value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2 text-[10px] text-white focus:outline-none">
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Evening">Evening</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-500 block uppercase">CRM Notes</label>
                  <textarea rows={2} placeholder="Add context on call summary..." value={salesNotes} onChange={(e) => setSalesNotes(e.target.value)} className="w-full bg-slate-950 border border-slate-855 rounded-xl p-2 text-xs text-white focus:outline-none resize-none" />
                </div>

                <Button type="submit" className="w-full py-2.5">Capture Lead to Pipeline</Button>
              </form>
            </Modal>
          </div>
        );

      case "followups":
        return (
          <div className="space-y-5">
            <div className="border-b border-slate-900 pb-3">
              <h3 className="text-base font-bold text-white">Daily Follow-Up Queue</h3>
              <p className="text-xs text-slate-400">Prospects requiring immediate contact calls today</p>
            </div>

            <div className="space-y-3">
              {enquiries.filter(e => e.status !== "Joined").map((enq) => (
                <Card key={enq.id} className="p-4 bg-slate-900/60 border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-white">{enq.name}</h4>
                    <span className="text-[10px] text-violet-400 font-bold bg-violet-500/5 px-2 py-0.5 rounded-md border border-violet-500/20">
                      {enq.status}
                    </span>
                  </div>
                  
                  <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-xl space-y-1">
                    <div>Phone: <strong className="text-slate-200">{enq.phone}</strong></div>
                    <div>Preferred Slot: <strong className="text-slate-200">{enq.preferredTime}</strong></div>
                    {enq.salesNotes && (
                      <p className="italic text-slate-500 text-[10px] mt-1 border-t border-slate-900 pt-1">
                        Notes: "{enq.salesNotes}"
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => triggerCall(enq.phone)}
                      className="flex-1 text-xs py-2 flex items-center justify-center gap-1.5"
                    >
                      <FiPhone className="w-3.5 h-3.5" /> Call Lead
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => triggerWhatsApp(enq.phone, `Hi ${enq.name.split(" ")[0]}, this is Sales from Antigravity Gyms. Following up on your fitness goals inquiry. Let us know if you'd like to drop by today!`)}
                      className="flex-1 text-xs py-2 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/5 flex items-center justify-center gap-1.5"
                    >
                      <FiMessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <div className="text-center py-2">
              <Avatar name="Sales Advisor" size="xl" className="mx-auto" />
              <h3 className="text-lg font-bold text-white mt-3">Sales Advisor Team</h3>
              <p className="text-xs text-slate-400 font-medium">Front Desk & CRM Lead Representative</p>
              
              <div className="mt-3 inline-flex items-center gap-2">
                <Badge variant="primary">Target: 30 / mo</Badge>
                <Badge variant="success">Shift: Full Time</Badge>
              </div>
            </div>

            <Card className="p-4 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">CRM Guidelines</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log every walk-in or website enquiry here immediately. Make sure to schedule a follow-up 
                date so it lists automatically on the follow-up queue panel.
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
