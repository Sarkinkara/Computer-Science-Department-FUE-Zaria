import React from 'react';

export default function History() {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Our Legacy & Blueprint</h1>
      <p className="text-sm text-slate-500 mb-6 font-medium">Department of Computer Science • Established 1984</p>
      
      <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600 space-y-4">
        <p>
          Founded during the dawn of personal computing, the Department of Computer Science was established to pioneer cutting-edge technological education. Over the past decades, it has evolved from basic mainframe systems into an institution driving research in artificial intelligence, cryptography, and scalable distributed architectures.
        </p>
        <blockquote className="border-l-4 border-indigo-600 pl-4 italic font-medium text-slate-800 bg-slate-50 p-3 rounded-r-lg">
          "The best way to predict the future is to invent it." — Our Departmental Founding Ethos.
        </blockquote>
        <p>
          Today, we remain committed to training next-generation software architects, system researchers, and engineering innovators globally.
        </p>
      </div>
    </div>
  );
}