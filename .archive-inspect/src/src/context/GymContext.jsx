import React, { createContext, useState, useEffect } from "react";
import {
  initialWorkoutLevels,
  initialMembers,
  initialEnquiries,
  initialComplaints,
  initialTrainers,
  initialAnnouncements,
  initialNotifications,
  initialChartData
} from "../data/mockData";

export const GymContext = createContext();

export const GymProvider = ({ children }) => {
  // Authentication & Active User
  const [activeRole, setActiveRole] = useState("customer"); // 'customer', 'trainer', 'sales', 'admin'
  const [activeMemberId, setActiveMemberId] = useState("mem_1"); // Rahul Sharma (default)
  const [activeTrainerId, setActiveTrainerId] = useState("trn_1"); // Coach Vikram (default)

  // Core Data States
  const [members, setMembers] = useState(initialMembers);
  const [workoutLevels, setWorkoutLevels] = useState(initialWorkoutLevels);
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [complaints, setComplaints] = useState(initialComplaints);
  const [trainers, setTrainers] = useState(initialTrainers);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [notifications, setNotifications] = useState(initialNotifications);

  // Today's Progress (Weight & Reps tracker for the customer's workout session today)
  // Structured as: { [memberId]: { [exerciseId]: { weight: 0, reps: 0, completed: false } } }
  const [todaysProgress, setTodaysProgress] = useState({
    mem_1: {
      w3_ex1: { weight: 80, reps: 10, completed: true },
      w3_ex2: { weight: 75, reps: 8, completed: false }
    }
  });

  // 1. Temporary Workout Adjustments
  // Allows the trainer to add/remove/replace exercises for a member for today only
  const updateWorkoutAdjustment = (memberId, adjustment) => {
    setMembers(prevMembers =>
      prevMembers.map(member => {
        if (member.id === memberId) {
          return {
            ...member,
            todaysWorkoutAdjustment: adjustment // can be null or { exercises, reason }
          };
        }
        return member;
      })
    );
  };

  // 2. Add New Fitness Test Record
  const addFitnessTest = (memberId, testRecord) => {
    setMembers(prevMembers =>
      prevMembers.map(member => {
        if (member.id === memberId) {
          return {
            ...member,
            fitnessTestHistory: [...member.fitnessTestHistory, testRecord]
          };
        }
        return member;
      })
    );

    // Add a notification for the trainer/admin
    const member = members.find(m => m.id === memberId);
    addNotification({
      type: "Fitness Test Reminder",
      message: `📋 Fitness test recorded for ${member?.name || "Member"}. Results updated in history.`,
      time: "Just now",
      unread: true
    });
  };

  // 3. PT Session Logging
  const logPTSession = (memberId, sessionLog) => {
    setMembers(prevMembers =>
      prevMembers.map(member => {
        if (member.id === memberId && member.ptPackage) {
          const completed = member.ptPackage.completed + 1;
          const remaining = Math.max(0, member.ptPackage.sessionsPurchased - completed);
          return {
            ...member,
            ptPackage: {
              ...member.ptPackage,
              completed,
              remaining,
              history: [sessionLog, ...member.ptPackage.history]
            }
          };
        }
        return member;
      })
    );
  };

  // 4. Update Member Details (membership type, workout level)
  const updateMemberWorkoutLevel = (memberId, newLevel) => {
    setMembers(prevMembers =>
      prevMembers.map(member => {
        if (member.id === memberId) {
          return {
            ...member,
            workoutLevel: newLevel,
            todaysWorkoutAdjustment: null // Reset adjustments when workout level changes
          };
        }
        return member;
      })
    );
  };

  // 5. CRM Lead Management
  const addEnquiry = (enquiry) => {
    const newEnq = {
      id: `enq_${Date.now()}`,
      dateCreated: new Date().toISOString().split("T")[0],
      ...enquiry
    };
    setEnquiries(prev => [newEnq, ...prev]);

    addNotification({
      type: "Gym Announcement",
      message: `👤 New CRM lead captured: ${enquiry.name} (${enquiry.goal}).`,
      time: "Just now",
      unread: true
    });
  };

  const updateEnquiryStatus = (enquiryId, status) => {
    setEnquiries(prev =>
      prev.map(enq => (enq.id === enquiryId ? { ...enq, status } : enq))
    );
  };

  // 6. Complaint Management
  const addComplaint = (complaint) => {
    const newComp = {
      id: `comp_${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
      ...complaint
    };
    setComplaints(prev => [newComp, ...prev]);

    addNotification({
      type: "Absent 5 Days", // category mapping fallback
      message: `⚠️ New complaint received from ${complaint.memberName}: "${complaint.category}".`,
      time: "Just now",
      unread: true
    });
  };

  const updateComplaintStatus = (complaintId, status) => {
    setComplaints(prev =>
      prev.map(comp => (comp.id === complaintId ? { ...comp, status } : comp))
    );
  };

  // 7. Edit Master Workouts (Admin action)
  const updateMasterWorkoutLevel = (levelId, updatedExercises) => {
    setWorkoutLevels(prev => ({
      ...prev,
      [levelId]: {
        ...prev[levelId],
        exercises: updatedExercises
      }
    }));
  };

  // 8. Notifications helper
  const addNotification = (notif) => {
    setNotifications(prev => [
      { id: `not_${Date.now()}`, unread: true, ...notif },
      ...prev
    ]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  // 9. Update Today's Workout Exercise Progress
  const updateExerciseProgress = (memberId, exerciseId, weight, reps, completed) => {
    setTodaysProgress(prev => {
      const memberProg = prev[memberId] || {};
      return {
        ...prev,
        [memberId]: {
          ...memberProg,
          [exerciseId]: { weight: parseFloat(weight) || 0, reps: parseInt(reps) || 0, completed }
        }
      };
    });
  };

  return (
    <GymContext.Provider
      value={{
        activeRole,
        setActiveRole,
        activeMemberId,
        setActiveMemberId,
        activeTrainerId,
        setActiveTrainerId,
        members,
        workoutLevels,
        enquiries,
        complaints,
        trainers,
        announcements,
        notifications,
        todaysProgress,
        updateWorkoutAdjustment,
        addFitnessTest,
        logPTSession,
        updateMemberWorkoutLevel,
        addEnquiry,
        updateEnquiryStatus,
        addComplaint,
        updateComplaintStatus,
        updateMasterWorkoutLevel,
        updateExerciseProgress,
        markAllNotificationsRead,
        chartData: initialChartData
      }}
    >
      {children}
    </GymContext.Provider>
  );
};
