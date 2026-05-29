import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({ id_number: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Authentication aborted.');
      
      localStorage.setItem('token', data.token);
      setUser(data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
      <h2 className="text-2xl font-black text-center text-slate-900 mb-2">Sign In Portal</h2>
      <p className="text-center text-xs text-slate-500 mb-6 font-medium">Computer Science Hub Environment</p>
      
      <div className="flex gap-4 mb-6 bg-slate-100 p-1 rounded-xl">
        <button 
          onClick={() => { setIsAdmin(false); setError(''); }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${!isAdmin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
        >
          Student Login
        </button>
        <button 
          onClick={() => { setIsAdmin(true); setError(''); }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${isAdmin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
        >
          Staff / Admin
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-lg mb-4 border border-red-100">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">{isAdmin ? "Staff Identification ID" : "Student Reg Number"}</label>
          <input 
            type="text" required
            value={formData.id_number}
            onChange={(e) => setFormData({...formData, id_number: e.target.value})}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Institutional Email</label>
          <input 
            type="email" required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Account Secret Password</label>
          <input 
            type="password" required
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3 rounded-xl transition shadow-md">
          Authenticate Credentials
        </button>
      </form>
    </div>
  );
}