import React, { useState, useEffect } from 'react';

export default function StaffDirectory() {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    fetch('/api/department/staff')
      .then(res => res.json())
      .then(data => setStaff(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Academic Hierarchy Directory</h1>
        <p className="text-sm text-slate-500 mt-1">Meet the distinguished faculty guiding our research and academic programs.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((s, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition duration-200 flex items-center gap-4">
            <div className="h-14 w-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
              {s.full_name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm leading-tight">{s.full_name}</h3>
              <p className="text-xs text-indigo-600 font-semibold mt-0.5">{s.academic_rank || "Faculty Member"}</p>
              <p className="text-xs text-slate-400 mt-1 font-mono break-all">{s.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}