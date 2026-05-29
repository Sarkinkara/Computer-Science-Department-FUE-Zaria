import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [level, setLevel] = useState(100);
  const [materials, setMaterials] = useState([]);
  const [notices] = useState([
    { id: 1, author: "Prof. Alan Turing", content: "Midsemester defensive hacking assignment for CSC 302 due by Friday Midnight.", date: "Just now" }
  ]);

  useEffect(() => {
    fetch(`/api/materials/${level}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setMaterials(Array.isArray(data) ? data : []))
    .catch(() => {});
  }, [level]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold tracking-tight">Academic Resource Vault</h2>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {[100, 200, 300, 400].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${level === lvl ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {lvl} Lvl
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {materials.length === 0 ? (
              <p className="text-slate-400 text-center py-8 text-sm">No verification certified documents found for this tier.</p>
            ) : (
              materials.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
                  <div>
                    <span className="text-xs font-mono uppercase font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 mr-2">{m.code}</span>
                    <span className="font-semibold text-slate-800 text-sm">{m.title}</span>
                    <p className="text-xs text-slate-400 mt-1">Uploaded by: {m.lecturer_name}</p>
                  </div>
                  <a href={m.file_url} className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-sm transition">Download</a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
        <h2 className="text-lg font-bold tracking-tight mb-4 text-slate-900 border-b pb-3">🚨 Tutor Board Broadcasts</h2>
        <div className="space-y-4">
          {notices.map((notice) => (
            <div key={notice.id} className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex justify-between text-xs text-amber-700 font-semibold mb-1">
                <span>{notice.author}</span>
                <span>{notice.date}</span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">{notice.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}