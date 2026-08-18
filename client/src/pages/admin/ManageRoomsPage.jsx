import { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';

const ManageRoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: '',
    building: '',
    floor: 1,
    capacity: 30,
    roomType: 'Classroom',
    amenities: [],
  });

  const roomTypes = ['Classroom', 'Seminar Hall', 'Auditorium', 'Computer Lab', 'Conference Room'];
  const availableAmenities = ['Projector', 'Air Conditioning', 'Audio System', 'Smart Board', 'Video Conferencing', 'Wi-Fi', 'LAN Ports'];

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await api.get('/rooms');
      setRooms(res.data);
    } catch (error) {
      toast.error('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await api.delete(`/rooms/${id}`);
      toast.success('Room deleted');
      fetchRooms();
    } catch (error) {
      toast.error('Failed to delete room');
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => {
      const amenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/rooms', formData);
      toast.success('Room added successfully');
      setIsModalOpen(false);
      setFormData({
        roomNumber: '',
        building: '',
        floor: 1,
        capacity: 30,
        roomType: 'Classroom',
        amenities: [],
      });
      fetchRooms();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add room');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Rooms</h1>
          <p className="text-sm text-gray-500 mt-1">Add, update, or decommission campus rooms.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Room
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Room</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Type / Capacity</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Amenities</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="py-8 text-center text-gray-500">Loading rooms...</td></tr>
              ) : rooms.length === 0 ? (
                <tr><td colSpan="5" className="py-8 text-center text-gray-500">No rooms found.</td></tr>
              ) : (
                rooms.map(room => (
                  <tr key={room._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{room.roomNumber}</div>
                      <div className="text-sm text-gray-500">{room.building}, Floor {room.floor}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-900">{room.roomType}</div>
                      <div className="text-sm text-gray-500">{room.capacity} seats</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.map(a => (
                          <span key={a} className="px-2 py-0.5 text-[10px] font-medium bg-indigo-50 text-indigo-600 rounded">
                            {a}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        room.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => handleDelete(room._id)} className="text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Room</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Room Number</label>
                        <input type="text" required value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border" placeholder="e.g. A-101"/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Building</label>
                        <input type="text" required value={formData.building} onChange={e => setFormData({...formData, building: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border" placeholder="e.g. Science Block"/>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Floor</label>
                        <input type="number" required min="0" value={formData.floor} onChange={e => setFormData({...formData, floor: parseInt(e.target.value)})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Capacity</label>
                        <input type="number" required min="1" value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"/>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Room Type</label>
                      <select value={formData.roomType} onChange={e => setFormData({...formData, roomType: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border">
                        {roomTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                      <div className="flex flex-wrap gap-2">
                        {availableAmenities.map(amenity => (
                          <label key={amenity} className="inline-flex items-center bg-gray-50 border border-gray-200 rounded px-3 py-1 cursor-pointer hover:bg-gray-100">
                            <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 mr-2" checked={formData.amenities.includes(amenity)} onChange={() => handleAmenityToggle(amenity)} />
                            <span className="text-xs text-gray-700">{amenity}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm">Save Room</button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRoomsPage;
