import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Compiler from './components/Compiler';
import Forum from './components/Forum';
import History from './components/History';
import StaffDirectory from './components/StaffDirectory';
import AIContextBubble from './components/AIContextBubble';

export const AuthContext = createContext(null);

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Router>
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
          {user && (
            <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  CS Department E-Library
                </span>
              </div>
              <div className="flex gap-6 text-sm font-medium items-center">
                <Link to="/dashboard" className="hover:text-blue-400 transition">Resources</Link>
                <Link to="/compiler" className="hover:text-blue-400 transition">Code Compilers</Link>
                <Link to="/forum" className="hover:text-blue-400 transition">Discussions</Link>
                <Link to="/history" className="hover:text-blue-400 transition">History</Link>
                <Link to="/staff" className="hover:text-blue-400 transition">Directory</Link>
                <button 
                  onClick={() => setUser(null)} 
                  className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-md text-xs font-semibold transition"
                >
                  Logout
                </button>
              </div>
            </nav>
          )}

          <main className="flex-grow container mx-auto p-6">
            <Routes>
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/compiler" element={user ? <Compiler /> : <Navigate to="/login" />} />
              <Route path="/forum" element={user ? <Forum /> : <Navigate to="/login" />} />
              <Route path="/history" element={<History />} />
              <Route path="/staff" element={<StaffDirectory />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </main>
          
          {user && <AIContextBubble />}
        </div>
      </Router>
    </AuthContext.Provider>
  );
}