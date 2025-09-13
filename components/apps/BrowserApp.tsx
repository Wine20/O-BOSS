
import React, { useState } from 'react';

const BrowserApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [url, setUrl] = useState('https://www.google.com/webhp?igu=1');
  const [inputValue, setInputValue] = useState('https://www.google.com');

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = inputValue;
    if (!/^https?:\/\//i.test(inputValue)) {
      finalUrl = 'https://' + inputValue;
    }
    // A simple proxy might be needed for sites that block iframing
    // For this example, we'll use a direct approach which may not work for all sites.
    // A more robust solution could use a CORS proxy.
    // Using google with webhp?igu=1 is a common trick to allow embedding
    if(inputValue.includes("google.com")) {
        setUrl('https://www.google.com/webhp?igu=1');
    } else {
        setUrl(finalUrl);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-800 rounded-b-md text-white">
      <div className="flex-shrink-0 p-1 bg-gray-700/50 flex items-center space-x-2">
        <form onSubmit={handleNavigate} className="flex-grow">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-gray-900 text-white px-3 py-1 rounded-md border border-yellow-500/30 focus:outline-none focus:ring-1 focus:ring-yellow-400 text-sm"
            placeholder="Enter URL and press Enter"
          />
        </form>
      </div>
      <div className="flex-grow bg-white">
        <iframe
          src={url}
          className="w-full h-full border-none"
          title="Universe Web Browser"
          sandbox="allow-scripts allow-same-origin allow-forms"
        ></iframe>
      </div>
    </div>
  );
};

export default BrowserApp;
