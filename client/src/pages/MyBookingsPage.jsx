import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my-bookings');
      // Sort by start time descending
      data.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch my bookings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled successfully');
      fetchMyBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>
      
      {loading ? (
        <div className="text-gray-500">Loading your bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          You have no active or past bookings.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {bookings.map((booking) => {
              const isPast = new Date(booking.endTime) < new Date();
              const isCancelled = booking.status === 'Cancelled';
              
              return (
                <li key={booking._id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{booking.title}</h3>
                    <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="font-medium text-gray-700">Room:</span> {booking.room?.roomNumber || 'Deleted Room'} ({booking.room?.building || 'N/A'})
                      </span>
                      <span className="hidden sm:inline text-gray-300">|</span>
                      <span>
                        {format(new Date(booking.startTime), 'MMM d, yyyy h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      isCancelled ? 'bg-rose-100 text-rose-800' :
                      isPast ? 'bg-gray-100 text-gray-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isCancelled ? 'Cancelled' : isPast ? 'Completed' : 'Confirmed'}
                    </span>
                    
                    {!isPast && !isCancelled && (
                      <button 
                        onClick={() => handleCancel(booking._id)}
                        className="text-sm font-medium text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
