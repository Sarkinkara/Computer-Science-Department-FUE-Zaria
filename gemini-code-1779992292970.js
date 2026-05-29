import React, { useState, useEffect } from 'react';

export default function AIContextBubble() {
  const [selectedText, setSelectedText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const text = selection.toString().trim();
      
      if (text.length > 2 && text.length < 300) {
        setSelectedText(text);
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        setCoords({
          top: rect.top + window.scrollY - 50,
          left: rect.left + window.scrollX
        });
        setVisible(true);
      } else {
        setVisible(false);
        if(!explanation) setExplanation('');
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [explanation]);

  const fetchAIExplanation = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ text: selectedText, context: document.title })
      });
      const data = await response.json();
      setExplanation(data.explanation);
    } catch (err) {
      setExplanation("Could not load simplified definition.");
    } finally {
      setLoading(false);
    }
  };

  if (!visible && !explanation) return null;

  return (
    <div className="absolute z-50 pointer-events-auto" style={{ top: coords.top, left: coords.left }}>
      {visible && !explanation && (
        <button 
          onClick={fetchAIExplanation}
          className="bg-indigo-600 text-white font-semibold text-xs px-3 py-1.5 rounded-lg shadow-xl hover:bg-indigo-700 transition transform hover:-translate-y-0.5"
        >
          ✨ Explain for Beginners
        </button>
      )}

      {explanation && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xl max-w-sm text-sm transition-all mt-2">
          <div className="flex justify-between items-center mb-2 border-b pb-1">
            <span className="font-bold text-indigo-600 flex items-center gap-1">✨ CS AI Assistant</span>
            <button onClick={() => setExplanation('')} className="text-slate-400 hover:text-slate-600 text-base font-bold">&times;</button>
          </div>
          {loading ? (
            <div className="flex gap-2 items-center text-slate-500 text-xs">
              <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-600"></span> Analyzing block infrastructure...
            </div>
          ) : (
            <p className="text-slate-600 leading-relaxed text-xs">{explanation}</p>
          )}
        </div>
      )}
    </div>
  );
}