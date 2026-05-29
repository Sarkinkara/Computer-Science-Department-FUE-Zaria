import React, { useState, useEffect } from 'react';

export default function Forum() {
  const [threads, setThreads] = useState([]);
  const [newThread, setNewThread] = useState({ title: '', content: '' });

  const fetchThreads = () => {
    fetch('/api/forum/threads', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setThreads(Array.isArray(data) ? data : []))
    .catch(() => {});
  };

  useEffect(() => { fetchThreads(); }, []);

  const handleCreateThread = async (e) => {
    e.preventDefault();
    await fetch('/api/forum/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(newThread)
    });
    setNewThread({ title: '', content: '' });
    fetchThreads();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Active Academic Conversations</h2>
        {threads.map(t => (
          <div key={t.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">{t.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Initiated by {t.full_name}</p>
            <p className="text-sm text-slate-600 mt-3 whitespace-pre-wrap">{t.content}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
        <h3 className="text-base font-bold text-slate-900 mb-4">Start Discussion Thread</h3>
        <form onSubmit={handleCreateThread} className="space-y-3">
          <input 
            type="text" placeholder="Topic Title" required
            value={newThread.title}
            onChange={(e) => setNewThread({...newThread, title: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none"
          />
          <textarea 
            placeholder="Context Description..." required rows={4}
            value={newThread.content}
            onChange={(e) => setNewThread({...newThread, content: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none resize-none"
          />
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-lg shadow-sm">
            Publish Post
          </button>
        </form>
      </div>
    </div>
  );
}