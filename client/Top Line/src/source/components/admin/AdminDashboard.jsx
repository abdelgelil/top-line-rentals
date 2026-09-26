import i18n from "../../../i18n.js";
import toast from 'react-hot-toast';
import { translateText } from '../../../utils/translateContent.js';
import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ApartmentForm from './ApartmentForm';
import { 
  fetchAllBookings, 
  updateBookingStatus, 
  deleteBooking,
  fetchApartments, 
  deleteApartment, 
  fetchAnalytics
} from '../../services/api';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tabFromPath = location.pathname.endsWith('/reservations')
    ? 'bookings'
    : (location.pathname.endsWith('/add-apartment') || location.pathname.endsWith('/apartments'))
      ? 'apartments'
      : 'analytics';
  const activeTab = tabFromPath;

  // Analytics State
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Bookings State
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  
  // Apartments State
  const [apartments, setApartments] = useState([]);
  const [loadingApartments, setLoadingApartments] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  useEffect(() => {
    if (location.pathname === '/admin') {
      navigate('/admin/analytics', { replace: true });
    }
    setShowAddModal(false);
  }, [location.pathname, navigate]);

  // Data Fetchers with useCallback
  const loadAnalytics = useCallback(async () => {
    try {
      setLoadingAnalytics(true);
      const res = await fetchAnalytics();
      if (res?.data?.success) {
        setAnalytics(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  }, []);

  const loadBookings = useCallback(async () => {
    try {
      setLoadingBookings(true);
      const response = await fetchAllBookings();
      if (response?.data?.success) {
        setBookings(response.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load admin bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  }, []);

  const loadApartments = useCallback(async () => {
    try {
      setLoadingApartments(true);
      const response = await fetchApartments();
      const fetched = response?.data?.data || response?.data || [];
      setApartments(Array.isArray(fetched) ? fetched : []);
    } catch (err) {
      console.error('Failed to load apartments:', err);
    } finally {
      setLoadingApartments(false);
    }
  }, []);

  // Fetch data conditionally on tab switch / mount
  useEffect(() => {
    if (activeTab === 'analytics' && !analytics) loadAnalytics();
    if (activeTab === 'bookings' && bookings.length === 0) loadBookings();
    if (activeTab === 'apartments' && apartments.length === 0) loadApartments();
  }, [activeTab, analytics, bookings.length, apartments.length, loadAnalytics, loadBookings, loadApartments]);

  // Handlers
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await updateBookingStatus(bookingId, newStatus);
      if (response?.data?.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? response.data.data : b))
        );
        loadAnalytics(); // Refresh KPI metrics
        toast.success(i18n.t('Booking status updated.'));
      }
    } catch (err) {
      toast.error(i18n.t('Failed to update booking status.'));
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm(i18n.t('Are you sure you want to permanently delete this reservation document?'))) return;
    try {
      await deleteBooking(bookingId);
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      toast.success(i18n.t('Reservation deleted.'));
      loadAnalytics();
    } catch (err) {
      toast.error(i18n.t('Failed to delete reservation document.'));
    }
  };

  const handleDeleteApartment = async (id) => {
    if (!window.confirm(i18n.t('Are you sure you want to delete this apartment?'))) return;
    try {
      await deleteApartment(id);
      setApartments((prev) => prev.filter((a) => a._id !== id));
      toast.success(i18n.t('Apartment deleted.'));
    } catch (err) {
      toast.error(i18n.t('Failed to delete apartment.'));
    }
  };

  const handleCreateApartment = (apartment) => {
    if (apartment) {
      setApartments((current) => [apartment, ...current]);
    }
    setShowAddModal(false);
    navigate('/admin/apartments');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tab Navigation Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{' '}{i18n.t("Admin Portal & Analytics")}{' '}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{' '}{i18n.t("Monitor frequent visitor metrics, client bookings, and apartment inventory.")}{' '}</p>
        </div>

        {/* Navigation Switch Buttons */}
        <div className="mt-4 sm:mt-0 flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => navigate('/admin/analytics')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >{' '}{i18n.t("Analytics")}{' '}</button>
          <button
            type="button"
            onClick={() => navigate('/admin/reservations')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'bookings'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >{' '}{i18n.t("Reservations (")}{bookings.length})
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/apartments')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'apartments'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >{' '}{i18n.t("Manage Apartments")}{' '}</button>
        </div>
      </div>

      {/* TAB 1: ANALYTICS OVERVIEW */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {loadingAnalytics || !analytics ? (
            <div className="text-center py-12 text-slate-500">{i18n.t("Loading platform analytics...")}</div>
          ) : (
            <>
              {/* KPI Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{i18n.t("Total Bookings")}</p>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">
                    {analytics?.metrics?.totalBookings ?? 0}
                  </h3>
                  <span className="text-xs text-slate-400">{i18n.t("All-time reservations")}</span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{' '}{i18n.t("Confirmed Bookings")}{' '}</p>
                  <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
                    {analytics?.metrics?.confirmedBookings ?? 0}
                  </h3>
                  <span className="text-xs text-slate-400">{i18n.t("Successful stays")}</span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">{' '}{i18n.t("Pending Review")}{' '}</p>
                  <h3 className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">
                    {analytics?.metrics?.pendingBookings ?? 0}
                  </h3>
                  <span className="text-xs text-slate-400">{i18n.t("Awaiting action")}</span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{' '}{i18n.t("Total Revenue")}{' '}</p>
                  <h3 className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-2">
                    ${(analytics?.metrics?.totalRevenue ?? 0).toLocaleString()}
                  </h3>
                  <span className="text-xs text-slate-400">{i18n.t("Confirmed revenue")}</span>
                </div>
              </div>

              {/* Top / Frequent Clients */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">{' '}{i18n.t("Frequent Visitors & VIP Clients")}{' '}</h2>
                  <p className="text-xs text-slate-500">{' '}{i18n.t("Clients with the highest frequency of reservation activity.")}{' '}</p>
                </div>

                {!analytics?.topClients || analytics.topClients.length === 0 ? (
                  <div className="p-6 text-center text-slate-500">{i18n.t("No client activity recorded yet.")}</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                          <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">{i18n.t("Client Info")}</th>
                          <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">{i18n.t("Total Bookings")}</th>
                          <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">{i18n.t("Confirmed Stays")}</th>
                          <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">{i18n.t("Total Revenue")}</th>
                          <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">{i18n.t("Last Activity")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {analytics.topClients.map((client, idx) => (
                          <tr key={client._id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300">
                                  #{idx + 1}
                                </span>
                                <div>
                                  <div className="font-semibold text-slate-900 dark:text-white">
                                    {client.guestName || 'Anonymous Guest'}
                                  </div>
                                  <div className="text-xs text-slate-500">{client._id || 'N/A'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                              {client.totalBookings}{' '}{i18n.t("reservation(s)")}{' '}</td>
                            <td className="px-6 py-4 text-emerald-600 font-semibold">
                              {client.confirmedBookings}{' '}{i18n.t("confirmed")}{' '}</td>
                            <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                              ${client.totalSpent?.toLocaleString() ?? 0}
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500">
                              {client.lastBookingDate ? new Date(client.lastBookingDate).toLocaleDateString() : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: RESERVATIONS VIEW */}
      {activeTab === 'bookings' && (
        <>
          {loadingBookings ? (
            <div className="text-center py-12 text-slate-500">{i18n.t("Loading Reservations...")}</div>
          ) : bookings.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 shadow rounded-lg p-6 text-center text-slate-500">{' '}{i18n.t("No reservations found in database.")}{' '}</div>
          ) : (
            <div className="bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">{i18n.t("Guest Name")}</th>
                      <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">{i18n.t("Email / Phone")}</th>
                      <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">{i18n.t("Apartment")}</th>
                      <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">{i18n.t("Check-In")}</th>
                      <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">{i18n.t("Check-Out")}</th>
                      <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">{i18n.t("Total Price")}</th>
                      <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">{i18n.t("Status")}</th>
                      <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200 text-right">{i18n.t("Actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {bookings.map((b) => (
                      <tr key={b._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                          {b.guestName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-slate-900 dark:text-slate-100 font-medium">{b.guestEmail}</div>
                          <div className="text-xs text-slate-500">{b.guestPhone || 'No phone provided'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            {translateText(b.apartment?.title || 'Deleted/Unknown Apartment')}
                          </div>
                          {b.apartment?.tower && (
                            <div className="text-xs text-slate-500">{i18n.t("Tower:")}{' '}{translateText(b.apartment.tower)}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                          {b.checkIn ? new Date(b.checkIn).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                          {b.checkOut ? new Date(b.checkOut).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900 dark:text-white">
                          ${b.totalPrice}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                              b.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : ['cancelled', 'canceled'].includes(b.status)
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {i18n.t(b.status)}
                          </span>
                          {['cancelled', 'canceled'].includes(b.status) && (
                            <span className="block mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                              {i18n.t('Apartment available for these dates')}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            {b.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(b._id, 'confirmed')}
                                  className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
                                >{' '}{i18n.t("Confirm")}{' '}</button>
                                <button
                                  onClick={() => handleStatusChange(b._id, 'cancelled')}
                                  className="px-3 py-1.5 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-colors"
                                >{' '}{i18n.t("Cancel")}{' '}</button>
                              </>
                            )}
                            <button
                              onClick={() => handleDeleteBooking(b._id)}
                              className="px-3 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
                              title={i18n.t("Delete Reservation Document")}
                            >{' '}{i18n.t("Delete")}{' '}</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 3: APARTMENTS VIEW */}
      {activeTab === 'apartments' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{i18n.t("Listed Apartments")}</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
            >{' '}{i18n.t("+ Add New Apartment")}{' '}</button>
          </div>

          {loadingApartments ? (
            <div className="text-center py-12 text-slate-500">{i18n.t("Loading Apartments...")}</div>
          ) : apartments.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 shadow rounded-lg p-6 text-center text-slate-500">{' '}{i18n.t("No apartments found.")}{' '}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apartments.map((apt) => (
                <div
                  key={apt._id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <img
                    src={apt.images?.[0] || 'https://via.placeholder.com/400x250'}
                    alt={translateText(apt.title)}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250'; }}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{translateText(apt.title)}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{translateText(apt.description)}</p>
                    <div className="flex justify-between items-center text-sm font-semibold text-slate-700 dark:text-slate-300 pt-2">
                      <span>{translateText(apt.tower || 'Tower 1')}</span>
                      <span>${apt.pricePerNight || apt.price}{' '}{i18n.t("/ night")}</span>
                    </div>
                  </div>
                  <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex justify-end">
                    <button
                      onClick={() => handleDeleteApartment(apt._id)}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
                    >{' '}{i18n.t("Delete Apartment")}{' '}</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Apartment Modal */}
          {showAddModal && (
            <ApartmentForm
              isOpen
              onClose={() => setShowAddModal(false)}
              onSubmit={handleCreateApartment}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
