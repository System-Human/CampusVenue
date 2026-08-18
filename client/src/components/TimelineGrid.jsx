import React from 'react';
import { format, isSameHour } from 'date-fns';

const TimelineGrid = ({ rooms, bookings, selectedDate, onSlotClick }) => {
  // Generate hours from 8 AM to 8 PM
  const hours = Array.from({ length: 13 }, (_, i) => i + 8);

  const getSlotStatus = (room, hour) => {
    const slotStart = new Date(selectedDate);
    slotStart.setHours(hour, 0, 0, 0);
    
    const slotEnd = new Date(selectedDate);
    slotEnd.setHours(hour + 1, 0, 0, 0);

    const booking = bookings.find(b => {
      const bStart = new Date(b.startTime);
      const bEnd = new Date(b.endTime);
      return b.room && b.room._id === room._id && 
             b.status === 'Confirmed' &&
             bStart < slotEnd && 
             bEnd > slotStart;
    });

    if (booking) return { status: 'booked', booking };
    if (room.status === 'Maintenance') return { status: 'maintenance' };
    return { status: 'available' };
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-2 md:p-4 rounded-xl">
      <div className="w-max md:w-full min-w-full border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
        {/* Header Row (Hours) */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <div className="sticky left-0 z-20 w-24 md:w-48 shrink-0 p-3 md:p-4 font-semibold text-gray-700 border-r border-gray-200 bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
            Rooms
          </div>
          <div className="flex-1 flex">
            {hours.map(hour => (
              <div key={hour} className="flex-1 min-w-[60px] md:min-w-0 text-center py-3 text-xs md:text-sm font-medium text-gray-600 border-r border-gray-200 last:border-r-0">
                {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </div>
            ))}
          </div>
        </div>

        {/* Room Rows */}
        <div className="divide-y divide-gray-200">
          {rooms.map(room => (
            <div key={room._id} className="flex hover:bg-gray-50 transition-colors">
              <div className="sticky left-0 z-10 w-24 md:w-48 shrink-0 p-2 md:p-4 border-r border-gray-200 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                <div className="font-semibold text-gray-900 text-sm md:text-base">{room.roomNumber}</div>
                <div className="text-[10px] md:text-xs text-gray-500 truncate">{room.building}</div>
                <div className="hidden md:block text-xs text-gray-400 mt-1 capitalize">{room.roomType}</div>
              </div>
              <div className="flex-1 flex">
                {hours.map(hour => {
                  const { status, booking } = getSlotStatus(room, hour);
                  
                  let slotClasses = "flex-1 border-r border-gray-200 last:border-r-0 relative group p-1 transition-all ";
                  if (status === 'available') {
                    slotClasses += "hover:bg-emerald-50 cursor-pointer";
                  } else if (status === 'booked') {
                    slotClasses += "bg-rose-100 cursor-not-allowed";
                  } else if (status === 'maintenance') {
                    slotClasses += "bg-amber-100 cursor-not-allowed";
                  }

                  return (
                    <div 
                      key={`${room._id}-${hour}`} 
                      className={`${slotClasses} min-w-[60px] md:min-w-0`}
                      onClick={() => status === 'available' && onSlotClick(room, hour)}
                    >
                      {status === 'available' && (
                        <div className="hidden md:group-hover:flex absolute inset-0 items-center justify-center text-xs font-bold text-emerald-600">
                          Book
                        </div>
                      )}
                      {status === 'booked' && booking && (
                        <div className="absolute inset-0 p-1 overflow-hidden">
                           <div className="bg-rose-200 text-rose-800 text-[9px] md:text-[10px] font-semibold rounded px-1 h-full flex flex-col justify-center leading-tight overflow-hidden overflow-ellipsis whitespace-nowrap md:whitespace-normal">
                             <span className="truncate">{booking.title}</span>
                           </div>
                        </div>
                      )}
                       {status === 'maintenance' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                           <span className="text-amber-800 text-[10px] md:text-xs font-bold">Maint.</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {rooms.length === 0 && (
             <div className="p-8 text-center text-gray-500">No rooms found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineGrid;
