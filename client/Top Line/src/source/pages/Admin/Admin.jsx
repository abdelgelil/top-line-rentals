import React, { useState, useEffect } from 'react';
import { Building2, Calendar, DollarSign, Users, RefreshCw, CheckCircle, Clock } from 'lucide-react';
import { fetchApartments } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export const Admin = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock stats for dashboard demonstration
  const stats = [
    { label: 'Total Units', value: apartments.length || '8', icon: Building2, color: 'text-indigo-500' },
    { label: 'Active Bookings', value: '14', icon: Calendar, color: 'text-emerald-500' },
    { label: 'Monthly Revenue', value: formatCurrency(145000), icon: DollarSign, color: 'text-amber-500' },
    { label: 'Total Guests', value: '38', icon: Users, color: 'text-sky-500' },
  ];

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetchApartments();
      setApartments(res.data || []);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Management Dashboard</h1>
          <p className="text-xs md:text-sm text-slate-500">Monitor property performance and guest reservations</p>
        </div>
        <button
          onClick={loadDashboard}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md bg-white/40 dark:bg-slate-800/40 border border-white/20 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-white/60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/40 border border-white/30 dark:border-white/10 p-6 rounded-3xl shadow-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-2xl bg-white/40 dark:bg-slate-800/50 border border-white/20 ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Property Inventory Overview Table */}
      <div className="backdrop-blur-2xl bg-white/30 dark:bg-slate-900/40 border border-white/30 dark:border-white/10 rounded-3xl shadow-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Managed Units Inventory</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="text-xs uppercase bg-white/40 dark:bg-slate-800/40 border-b border-slate-200/50 dark:border-slate-800 text-slate-500">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Unit Title</th>
                <th className="px-4 py-3">Tower</th>
                <th className="px-4 py-3">Bed / Bath</th>
                <th className="px-4 py-3">Nightly Rate</th>
                <th className="px-4 py-3 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/30 dark:divide-slate-800/50">
              {apartments.map((unit) => (
                <tr key={unit.id} className="hover:bg-white/20 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{unit.title}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{unit.tower_name || 'San Stefano'}</td>
                  <td className="px-4 py-3 text-xs">{unit.bedrooms} Bed / {unit.bathrooms} Bath</td>
                  <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(unit.price_per_night)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3" /> Ready
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};