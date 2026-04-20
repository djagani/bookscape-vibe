'use client';

import { useState } from 'react';
import SearchBar from './SearchBar';
import ManualInputForm from './ManualInputForm';

export default function InputTabs() {
  const [activeTab, setActiveTab] = useState<'search' | 'manual'>('search');

  return (
    <div className="w-full">
      <div className="flex gap-1 mb-6 justify-center p-1 rounded-full backdrop-blur-xl" style={{
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <button
          onClick={() => setActiveTab('search')}
          className="px-6 py-2.5 rounded-full font-medium transition-all duration-200 ui-text text-sm"
          style={{
            backgroundColor: activeTab === 'search' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
            color: activeTab === 'search' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.5)',
            fontWeight: activeTab === 'search' ? 600 : 500,
          }}
        >
          Search Book
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className="px-6 py-2.5 rounded-full font-medium transition-all duration-200 ui-text text-sm"
          style={{
            backgroundColor: activeTab === 'manual' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
            color: activeTab === 'manual' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.5)',
            fontWeight: activeTab === 'manual' ? 600 : 500,
          }}
        >
          Enter Quote/Theme
        </button>
      </div>

      {activeTab === 'search' ? <SearchBar /> : <ManualInputForm />}
    </div>
  );
}
