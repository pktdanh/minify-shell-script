'use client';

import { useState } from 'react';

export default function Home() {
  const [script, setScript] = useState<string>('');
  const [minifiedScript, setMinifiedScript] = useState<string>('');

  const handleMinify = async () => {
    const response = await fetch('/api/minify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ script }),
    });
    const data = await response.json();
    setMinifiedScript(data.minifiedScript);
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-start px-2 py-4">
        <div className="w-6/12">
          <h1 className="text-2xl font-bold mb-4">Shell Script Minifier</h1>
          <textarea
            className="w-full min-h-[500px] p-2 border border-gray-300 rounded mb-4"
            rows={10}
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Enter your shell script here"
          />
        </div>
        <div className="w-6/12">
          <h2 className="text-2xl font-bold mb-4">Minified Script</h2>
          <textarea
            className="w-full min-h-[500px] p-2 border border-gray-300 rounded"
            rows={10}
            value={minifiedScript}
            readOnly
            placeholder="Your minified script will appear here"
          />
        </div>
      </div>
      <div className="flex justify-center">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded"
          onClick={handleMinify}
        >
          Minify Script
        </button>
      </div>
    </div>
  );
}
