
import React from 'react';
import { SavedSession } from '../types';

interface ProfileViewProps {
  sessions: SavedSession[];
  onBack: () => void;
  onSelect: (session: SavedSession) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ sessions, onBack, onSelect }) => {
  return (
    <div className="flex flex-col min-h-screen px-6 pt-6 pb-8 gradient-bg overflow-y-auto">
      <nav className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 -ml-2 bg-white rounded-full shadow-sm mr-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" strokeWidth="2">
            <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="flex-1 text-center font-bold text-slate-800 text-[10px] uppercase tracking-[0.2em]">My Manifestations</span>
      </nav>

      <header className="mb-8">
        <h1 className="serif text-4xl heading-gradient italic">Your Library</h1>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">{sessions.length} sessions created</p>
      </header>

      {sessions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 grayscale">
          <div className="w-24 h-24 rounded-full bg-slate-200 mb-4 flex items-center justify-center text-4xl">✨</div>
          <p className="font-bold text-slate-800">No sessions yet.</p>
          <p className="text-xs text-slate-500">Your future self is waiting.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <button 
              key={session.id}
              onClick={() => onSelect(session)}
              className="w-full text-left bg-white p-5 rounded-3xl border border-slate-100 card-shadow flex items-center gap-4 hover:scale-[1.01] transition-transform active:scale-[0.99]"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#9381BA] flex items-center justify-center text-white text-xl">
                🧘
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">{session.date}</p>
                <p className="text-sm font-bold text-slate-900 truncate">Morning Manifestation</p>
                <p className="text-[10px] text-slate-500 italic truncate opacity-70">"{session.vision.substring(0, 40)}..."</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-full">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" strokeWidth="3">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileView;
