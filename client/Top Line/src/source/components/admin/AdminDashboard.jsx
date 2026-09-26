import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ApartmentForm from './ApartmentForm';
import { 
  fetchAllBookings, 
  updateBookingStatus, 
  deleteBooking,
  fetchApartments, 
  deleteApartment, 
  createApartment,
  fetchAnalytics
} from '../../services/api';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tabFromPath = location.pathname.endsWith('/reservations')
    ? 'bookings'
    : location.pathname.endsWith('/add-apartment')
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
    setShowAddModal(location.pathname.endsWith('/add-apartment'));
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
      }
    } catch (err) {
      alert('Failed to update booking status.');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to permanently delete this reservation document?')) return;
    try {
      await deleteBooking(bookingId);
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      loadAnalytics();
    } catch (err) {
      alert('Failed to delete reservation document.');
    }
  };

  const handleDeleteApartment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this apartment?')) return;
    try {
      await deleteApartment(id);
      setApartments((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert('Failed to delete apartment.');
    }
  };

  const handleCreateApartment = async (formData) => {
    try {
      const token = await getToken();
      const response = await createApartment(formData, token);
      if (response?.data?.success || response?.status === 201) {
        alert('Apartment created successfully!');
        setShowAddModal(false);
        navigate('/admin/analytics');
        loadApartments();
      }
    } catch (err) {
      alert('Failed to create apartment.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tab Navigation Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Admin Portal & Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monitor frequent visitor metrics, client bookings, and apartment inventory.
          </p>
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
          >
            Analytics
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/reservations')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'bookings'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Reservations ({bookings.length})
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/add-apartment')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'apartments'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Add Apartment
          </button>
        </div>
      </div>

      {/* TAB 1: ANALYTICS OVERVIEW */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {loadingAnalytics || !analytics ? (
            <div className="text-center py-12 text-slate-500">Loading platform analytics...</div>
          ) : (
            <>
              {/* KPI Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Bookings</p>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">
                    {analytics?.metrics?.totalBookings ?? 0}
                  </h3>
                  <span className="text-xs text-slate-400">All-time reservations</span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Confirmed Bookings
                  </p>
                  <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
                    {analytics?.metrics?.confirmedBookings ?? 0}
                  </h3>
                  <span className="text-xs text-slate-400">Successful stays</span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    Pending Review
                  </p>
                  <h3 className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">
                    {analytics?.metrics?.pendingBookings ?? 0}
                  </h3>
                  <span className="text-xs text-slate-400">Awaiting action</span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    Total Revenue
                  </p>
                  <h3 className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-2">
                    ${(analytics?.metrics?.totalRevenue ?? 0).toLocaleString()}
                  </h3>
                  <span className="text-xs text-slate-400">Confirmed revenue</span>
                </div>
              </div>

              {/* Top / Frequent Clients */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Frequent Visitors & VIP Clients
                  </h2>
                  <p className="text-xs text-slate-500">
                    Clients with the highest frequency of reservation activity.
                  </p>
                </div>

                {!analytics?.topClients || analytics.topClients.length === 0 ? (
                  <div className="p-6 text-center text-slate-500">No client activity recorded yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                          <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Client Info</th>
                          <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Total Bookings</th>
                          <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Confirmed Stays</th>
                          <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Total Revenue</th>
                          <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Last Activity</th>
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
                              {client.totalBookings} reservation(s)
                            </td>
                            <td className="px-6 py-4 text-emerald-600 font-semibold">
                              {client.confirmedBookings} confirmed
                            </td>
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
            <div className="text-center py-12 text-slate-500">Loading Reservations...</div>
          ) : bookings.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 shadow rounded-lg p-6 text-center text-slate-500">
              No reservations found in database.
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Guest Name</th>
                      <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Email / Phone</th>
                      <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Apartment</th>
                      <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Check-In</th>
                      <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Check-Out</th>
                      <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Total Price</th>
                      <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Status</th>
                      <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200 text-right">Actions</th>
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
                            {b.apartment?.title || 'Deleted/Unknown Apartment'}
                          </div>
                          {b.apartment?.tower && (
                            <div className="text-xs text-slate-500">Tower: {b.apartment.tower}</div>
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
                                : b.status === 'cancelled'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            {b.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(b._id, 'confirmed')}
                                  className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleStatusChange(b._id, 'cancelled')}
                                  className="px-3 py-1.5 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-colors"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDeleteBooking(b._id)}
                              className="px-3 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
                              title="Delete Reservation Document"
                            >
                              Delete
                            </button>
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
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Listed Apartments</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
            >
              + Add New Apartment
            </button>
          </div>

          {loadingApartments ? (
            <div className="text-center py-12 text-slate-500">Loading Apartments...</div>
          ) : apartments.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 shadow rounded-lg p-6 text-center text-slate-500">
              No apartments found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apartments.map((apt) => (
                <div
                  key={apt._id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <img
                    src={apt.images?.[0] || 'https://via.placeholder.com/400x250'}
                    alt={apt.title}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250'; }}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{apt.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{apt.description}</p>
                    <div className="flex justify-between items-center text-sm font-semibold text-slate-700 dark:text-slate-300 pt-2">
                      <span>{apt.tower || 'Tower 1'}</span>
                      <span>${apt.pricePerNight || apt.price} / night</span>
                    </div>
                  </div>
                  <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex justify-end">
                    <button
                      onClick={() => handleDeleteApartment(apt._id)}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
                    >
                      Delete Apartment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Apartment Modal */}
          {showAddModal && (
            <ApartmentForm
              isOpen
              onClose={() => navigate('/admin/analytics')}
              onSubmit={handleCreateApartment}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
