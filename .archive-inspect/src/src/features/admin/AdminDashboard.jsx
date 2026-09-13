import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reimporting, setReimporting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    adminApi.getStats()
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleReimport = async () => {
    setReimporting(true);
    setStatusMsg('');
    try {
      const res = await adminApi.reimportContent();
      setStatusMsg(res.data || 'Content successfully re-scanned and synchronized!');
      // Refresh stats
      const updated = await adminApi.getStats();
      setStats(updated.data);
    } catch (e) {
      setStatusMsg('Failed to reimport content: ' + (e.message || 'Unknown error'));
    } finally {
      setReimporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-white">
            Admin Maintenance & Telemetry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            System health, database metrics, and hot-reload content synchronization
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleReimport}
          isLoading={reimporting}
          icon={<span>🔄</span>}
        >
          Re-scan & Import Content Files
        </Button>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 text-xs font-mono">
          {statusMsg}
        </div>
      )}

      {/* Platform Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Users', val: stats?.totalUsers ?? '—', icon: '👥' },
          { label: 'Courses', val: stats?.totalCourses ?? '—', icon: '📚' },
          { label: 'Topics', val: stats?.totalTopics ?? '—', icon: '📑' },
          { label: 'Questions', val: stats?.totalQuestions ?? '—', icon: '❓' },
          { label: 'Sessions', val: stats?.totalQuizSessions ?? '—', icon: '🎯' },
          { label: 'Total Attempts', val: stats?.totalAttempts ?? '—', icon: '⚡' },
        ].map((item, idx) => (
          <Card key={idx} className="border-white/10 p-4 text-center space-y-1">
            <div className="text-2xl">{item.icon}</div>
            <div className="text-2xl font-display font-extrabold text-white">{item.val}</div>
            <div className="text-[11px] font-mono text-slate-400 uppercase">{item.label}</div>
          </Card>
        ))}
      </div>

    </div>
  );
};
