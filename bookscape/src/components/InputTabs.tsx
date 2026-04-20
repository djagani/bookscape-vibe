'use client';

import { useState } from 'react';
import SearchBar from './SearchBar';
import ManualInputForm from './ManualInputForm';

export default function InputTabs() {
  const [activeTab, setActiveTab] = useState<'search' | 'manual'>('search');

  return (
    <div>
      <div className="flex gap-4 mb-6 border-b border-gray-600">
        <button
          onClick={() => setActiveTab('search')}
          className={`pb-2 px-4 font-medium transition ${
            activeTab === 'search'
              ? 'border-b-2 border-blue-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Search Book
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`pb-2 px-4 font-medium transition ${
            activeTab === 'manual'
              ? 'border-b-2 border-blue-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Enter Quote/Theme
        </button>
      </div>

      {activeTab === 'search' ? <SearchBar /> : <ManualInputForm />}
    </div>
  );
}
