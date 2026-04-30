import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  bookings: any[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ bookings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const onDateClick = (day: Date) => {
    // Optional: handle day click
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-blue-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            Today
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-blue-50 rounded-full transition-colors border border-blue-100">
            <ChevronLeft className="w-5 h-5 text-blue-600" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-blue-50 rounded-full transition-colors border border-blue-100">
            <ChevronRight className="w-5 h-5 text-blue-600" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = 'EEEE';
    const startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center font-bold text-xs text-gray-400 uppercase tracking-wider py-2" key={i}>
          {format(addDays(startDate, i), dateFormat).substring(0, 3)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = 'd';
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        
        // Find bookings for this day
        const dayBookings = bookings.filter(b => {
          try {
            const bDate = parseISO(b.date);
            return isSameDay(bDate, cloneDay);
          } catch (e) {
            return false;
          }
        });

        days.push(
          <div
            className={`min-h-[100px] p-2 border border-gray-100 transition-all ${
              !isSameMonth(day, monthStart)
                ? 'bg-gray-50/50 text-gray-300'
                : 'bg-white text-gray-700 hover:bg-blue-50/50 cursor-pointer'
            } ${isSameDay(day, new Date()) ? 'ring-2 ring-inset ring-blue-500/20' : ''}`}
            key={day.toString()}
            onClick={() => onDateClick(cloneDay)}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                isSameDay(day, new Date()) 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                  : !isSameMonth(day, monthStart) ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {formattedDate}
              </span>
              {dayBookings.length > 0 && (
                <div className="flex -space-x-1">
                  {dayBookings.slice(0, 3).map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-blue-500 border border-white" />
                  ))}
                  {dayBookings.length > 3 && (
                    <span className="text-[8px] text-blue-600 font-bold pl-1">+{dayBookings.length - 3}</span>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-1">
              {dayBookings.map((b, idx) => (
                <div 
                  key={idx} 
                  className="text-[10px] truncate bg-blue-50 text-blue-800 px-1.5 py-1 rounded-lg border border-blue-100 font-medium" 
                  title={`${b.time} - ${b.practitionerName}`}
                >
                  <span className="font-bold">{b.time.split(' ')[0]}</span> {b.practitionerName.split(' ')[1] || b.practitionerName}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="bg-white rounded-xl overflow-hidden border border-gray-200">{rows}</div>;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-50">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};
