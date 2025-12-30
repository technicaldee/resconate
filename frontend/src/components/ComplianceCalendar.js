import React, { useState } from 'react';

const ComplianceCalendar = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Nigerian compliance deadlines
  const complianceDeadlines = [
    {
      id: 1,
      title: 'PAYE Remittance',
      description: 'Pay As You Earn tax remittance to FIRS',
      deadline: 10, // 10th of every month
      frequency: 'monthly',
      priority: 'high',
      category: 'tax'
    },
    {
      id: 2,
      title: 'NSITF Contribution',
      description: 'Nigeria Social Insurance Trust Fund contribution',
      deadline: 15, // 15th of every month
      frequency: 'monthly',
      priority: 'high',
      category: 'social'
    },
    {
      id: 3,
      title: 'Pension Remittance (PenCom)',
      description: 'Pension contribution remittance',
      deadline: 7, // 7th of every month
      frequency: 'monthly',
      priority: 'high',
      category: 'pension'
    },
    {
      id: 4,
      title: 'ITF Contribution',
      description: 'Industrial Training Fund contribution',
      deadline: 31, // Last day of quarter
      frequency: 'quarterly',
      priority: 'medium',
      category: 'training'
    },
    {
      id: 5,
      title: 'NHF Remittance',
      description: 'National Housing Fund contribution',
      deadline: 10, // 10th of every month
      frequency: 'monthly',
      priority: 'medium',
      category: 'housing'
    },
    {
      id: 6,
      title: 'Annual Tax Return',
      description: 'Company income tax return filing',
      deadline: 6, // 6 months after year end
      frequency: 'annual',
      priority: 'high',
      category: 'tax'
    }
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const getDeadlinesForDate = (day) => {
    return complianceDeadlines.filter(deadline => {
      if (deadline.frequency === 'monthly') {
        return deadline.deadline === day;
      } else if (deadline.frequency === 'quarterly') {
        const quarter = Math.floor(selectedMonth / 3);
        const lastDay = getDaysInMonth(selectedMonth, selectedYear);
        return deadline.deadline === day && day === lastDay;
      } else if (deadline.frequency === 'annual') {
        // Annual deadlines would need more complex logic
        return false;
      }
      return false;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const deadlines = getDeadlinesForDate(day);
      days.push({ day, deadlines });
    }

    return (
      <div className="compliance-calendar">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {monthNames[selectedMonth]} {selectedYear}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                if (selectedMonth === 0) {
                  setSelectedMonth(11);
                  setSelectedYear(selectedYear - 1);
                } else {
                  setSelectedMonth(selectedMonth - 1);
                }
              }}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              ← Previous
            </button>
            <button
              onClick={() => {
                setSelectedMonth(new Date().getMonth());
                setSelectedYear(new Date().getFullYear());
              }}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              Today
            </button>
            <button
              onClick={() => {
                if (selectedMonth === 11) {
                  setSelectedMonth(0);
                  setSelectedYear(selectedYear + 1);
                } else {
                  setSelectedMonth(selectedMonth + 1);
                }
              }}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              Next →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map(day => (
            <div key={day} className="text-center text-gray-400 font-semibold py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => {
            if (date === null) {
              return <div key={index} className="aspect-square"></div>;
            }

            const isToday = 
              date.day === new Date().getDate() &&
              selectedMonth === new Date().getMonth() &&
              selectedYear === new Date().getFullYear();

            const isPast = new Date(selectedYear, selectedMonth, date.day) < new Date();

            return (
              <div
                key={index}
                className={`aspect-square p-2 rounded-lg border-2 ${
                  isToday
                    ? 'border-green-500 bg-green-500/10'
                    : isPast
                    ? 'border-gray-700 bg-gray-800/50'
                    : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                }`}
              >
                <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-green-400' : 'text-white'}`}>
                  {date.day}
                </div>
                <div className="space-y-1">
                  {date.deadlines.slice(0, 2).map(deadline => (
                    <div
                      key={deadline.id}
                      className={`text-xs px-1 py-0.5 rounded ${
                        deadline.priority === 'high'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                      title={deadline.title}
                    >
                      {deadline.title.substring(0, 10)}...
                    </div>
                  ))}
                  {date.deadlines.length > 2 && (
                    <div className="text-xs text-gray-400">+{date.deadlines.length - 2} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="compliance-calendar-page p-6" style={{ background: 'var(--dark-bg)', minHeight: '100vh' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Compliance Calendar</h1>
          <p className="text-gray-400 text-lg">
            Never miss a compliance deadline. View all Nigerian HR compliance filing dates in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Calendar */}
          <div className="md:col-span-2 card-ng">
            {renderCalendar()}
          </div>

          {/* Upcoming Deadlines */}
          <div className="card-ng">
            <h2 className="text-xl font-bold text-white mb-4">Upcoming Deadlines</h2>
            <div className="space-y-3">
              {complianceDeadlines
                .filter(d => d.frequency === 'monthly')
                .sort((a, b) => a.deadline - b.deadline)
                .map(deadline => {
                  const today = new Date();
                  const deadlineDate = new Date(selectedYear, selectedMonth, deadline.deadline);
                  const daysUntil = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div
                      key={deadline.id}
                      className={`p-3 rounded-lg border ${
                        daysUntil <= 3
                          ? 'bg-red-500/10 border-red-500/30'
                          : daysUntil <= 7
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-gray-800/50 border-gray-700'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="text-white font-semibold text-sm">{deadline.title}</div>
                        <div className={`text-xs px-2 py-1 rounded ${
                          deadline.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {deadline.priority}
                        </div>
                      </div>
                      <div className="text-gray-400 text-xs mb-1">{deadline.description}</div>
                      <div className="text-gray-300 text-xs">
                        Due: {deadline.deadline} {new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'short' })} 
                        {daysUntil >= 0 && (
                          <span className={`ml-2 ${daysUntil <= 3 ? 'text-red-400' : daysUntil <= 7 ? 'text-amber-400' : 'text-green-400'}`}>
                            ({daysUntil} days)
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* All Compliance Requirements */}
        <div className="card-ng">
          <h2 className="text-2xl font-bold text-white mb-6">All Compliance Requirements</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {complianceDeadlines.map(deadline => (
              <div
                key={deadline.id}
                className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-semibold">{deadline.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    deadline.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {deadline.priority}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-2">{deadline.description}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Frequency: {deadline.frequency}</span>
                  <span>Category: {deadline.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceCalendar;

