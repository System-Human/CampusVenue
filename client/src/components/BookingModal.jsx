import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { X, Clock, Users as UsersIcon, AlignLeft } from 'lucide-react';
import { format } from 'date-fns';

const BookingModal = ({ isOpen, onClose, initialData, rooms, onSuccess }) => {
  const [formData, setFormData] = useState({
    roomId: initialData?.room?._id || '',
    title: '',
    description: '',
    startTime: initialData?.startTime ? format(initialData.startTime, "yyyy-MM-dd'T'HH:mm") : '',
    endTime: initialData?.endTime ? format(initialData.endTime, "yyyy-MM-dd'T'HH:mm") : '',
    attendeesEstimate: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        roomId: initialData.room._id,
        startTime: format(initialData.startTime, "yyyy-MM-dd'T'HH:mm"),
        endTime: format(initialData.endTime, "yyyy-MM-dd'T'HH:mm"),
      }));
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorBanner(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorBanner(null);

    try {
      const payload = {
          ...formData,
          startTime: new Date(formData.startTime).toISOString(),
          endTime: new Date(formData.endTime).toISOString(),
      };
      if (formData.attendeesEstimate) {
          payload.attendeesEstimate = Number(formData.attendeesEstimate);
      } else {
          delete payload.attendeesEstimate;
      }

      await api.post('/bookings', payload);
      toast.success('Room booked successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      if (error.response?.status === 409) {
          setErrorBanner(error.response.data.message);
          toast.error('Booking conflict detected.');
      } else {
          toast.error(error.response?.data?.message || 'Failed to book room');
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedRoom = rooms.find(r => r._id === formData.roomId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl leading-6 font-bold text-gray-900" id="modal-title">
                  Book a Room
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {errorBanner && (
                <div className="mb-4 bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-md">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-rose-700 font-medium">
                                {errorBanner}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Room</label>
                <select
                  name="roomId"
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={formData.roomId}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select a room</option>
                  {rooms.map(room => (
                    <option key={room._id} value={room._id}>
                      {room.roomNumber} - {room.building} ({room.capacity} seats)
                    </option>
                  ))}
                </select>
                {selectedRoom && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {selectedRoom.amenities.map(amenity => (
                            <span key={amenity} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                {amenity}
                            </span>
                        ))}
                    </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Event Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Mid-term Exam"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1"><Clock className="w-4 h-4"/> Start Time</label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      required
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                      value={formData.startTime}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1"><Clock className="w-4 h-4"/> End Time</label>
                    <input
                      type="datetime-local"
                      name="endTime"
                      required
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                      value={formData.endTime}
                      onChange={handleChange}
                    />
                  </div>
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-1"><UsersIcon className="w-4 h-4"/> Estimated Attendees</label>
                  <input
                    type="number"
                    name="attendeesEstimate"
                    min="1"
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                    value={formData.attendeesEstimate}
                    onChange={handleChange}
                  />
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-1"><AlignLeft className="w-4 h-4"/> Description (Optional)</label>
                  <textarea
                    name="description"
                    rows={3}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                    value={formData.description}
                    onChange={handleChange}
                  />
              </div>

              <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-indigo-400"
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
