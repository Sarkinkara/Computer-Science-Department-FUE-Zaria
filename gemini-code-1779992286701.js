import React, { useState } from 'react';

export default function Compiler() {
  const [lang, setLang] = useState('python');
  const [code, setCode] = useState('print("Hello Dynamic Architecture World!")');
  const [terminalOut, setTerminalOut] = useState('');
  const [running, setRunning] = useState(false);

  const runCodeExecution = async () => {
    setRunning(true);
    try {
      const response = await fetch('/api/compiler/execute', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ language: lang, source_code: code })
      });
      const data = await response.json();
      setTerminalOut(data.output);
    } catch (err) {
      setTerminalOut("Execution engine connection error interface failure.");
    } finaly {
      setRunning(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
      <div className="flex flex-col bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800">
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            className="bg-slate-800 text-white font-mono text-xs rounded px-2.5 py-1 border border-slate-700 focus:outline-none"
          >
            <option value="python">Python 3</option>
            <option value="javascript">Node.js</option>
            <option value="cpp">C++ (GCC 11)</option>
          </select>
          <button 
            onClick={runCodeExecution} 
            disabled={running}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-1.5 rounded transition disabled:opacity-50"
          >
            {running ? "Running..." : "▶ Execute Run"}
          </button>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-grow w-full bg-slate-950 text-emerald-400 p-4 font-mono text-sm border-none focus:outline-none resize-none"
        />
      </div>

      <div className="flex flex-col bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-800">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800">
          <span className="text-xs text-slate-400 font-semibold font-mono uppercase tracking-wider">Console Standard Output</span>
        </div>
        <pre className="flex-grow p-4 font-mono text-xs text-slate-300 overflow-y-auto whitespace-pre-wrap leading-relaxed">
          {terminalOut || "System awaiting core binary output data compile execution requests..."}
        </pre>
      </div>
    </div>
  );
}