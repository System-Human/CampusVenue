import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import TimelineGrid from '../components/TimelineGrid';
import BookingModal from '../components/BookingModal';
import { format } from 'date-fns';

const DashboardPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      const [roomsRes, bookingsRes] = await Promise.all([
        api.get('/rooms'),
        api.get(`/bookings?date=${formattedDate}`)
      ]);
      
      setRooms(roomsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDate]);

  const handleSlotClick = (room, hour) => {
    const start = new Date(selectedDate);
    start.setHours(hour, 0, 0, 0);
    
    const end = new Date(selectedDate);
    end.setHours(hour + 1, 0, 0, 0);

    setSelectedSlot({ room, startTime: start, endTime: end });
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campus Availability</h1>
          <p className="text-gray-500 text-sm mt-1">View real-time room availability and book instantly.</p>
        </div>
        <div>
          <input 
            type="date" 
            className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">Loading timeline...</div>
        ) : (
          <TimelineGrid 
            rooms={rooms} 
            bookings={bookings} 
            selectedDate={selectedDate}
            onSlotClick={handleSlotClick}
          />
        )}
      </div>

      {isModalOpen && (
        <BookingModal 
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSlot(null);
          }}
          initialData={selectedSlot}
          rooms={rooms}
          onSuccess={fetchDashboardData}
        />
      )}
    </div>
  );
};

export default DashboardPage;
