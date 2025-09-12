import React, { useState, useEffect } from "react";

type Recording = {
  vessel: string;
  location: string;
  date: string;
  time: string;
  noiseLevel: string;
  clipLength: string;
  recordUrl: string;
};

interface AvailableRecordingsProps {
  recordings: Recording[];
  onLocationClick: (location: string) => void;
  onPlay?: (url: string) => void; // Added optional onPlay prop
}

// Extend Window interface for Mailchimp objects
declare global {
  interface Window {
    mcpopup?: {
      open: () => void;
    };
    mc4wp?: {
      forms: {
        show: () => void;
      };
    };
  }
}

// Fixed syntax error
const MAILCHIMP_SCRIPT = "https://chimpstatic.com/mcjs-connected/js/users/30e5b89b891e7b961c63e7d39/2318c630b0adc777855362be3.js";

const AvailableRecordings: React.FC<AvailableRecordingsProps> = ({
  recordings,
  onLocationClick,
  onPlay, // Added onPlay prop
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 5;
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = recordings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(recordings.length / recordsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  // Load Mailchimp script once
  useEffect(() => {
    if (!document.getElementById("mcjs")) {
      const script = document.createElement("script");
      script.id = "mcjs";
      script.innerHTML = `
        !function(c,h,i,m,p){
          m=c.createElement(h),
          p=c.getElementsByTagName(h)[0],
          m.async=1,
          m.src=i,
          p.parentNode.insertBefore(m,p)
        }(document,"script","${MAILCHIMP_SCRIPT}");
      `;
      document.head.appendChild(script);
      
      // Fixed cleanup function
      return () => {
        const existingScript = document.getElementById("mcjs");
        if (existingScript) {
          existingScript.remove();
        }
      };
    }
  }, []);

  // Fixed play button - should play audio, not show email subscription
  const handlePlayClick = (recordUrl: string) => {
    // If parent component provides onPlay handler, use it
    if (onPlay) {
      onPlay(recordUrl);
    } else {
      // Fallback: create audio element and play
      const audio = new Audio(recordUrl);
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        alert('Unable to play audio file');
      });
    }
  };

  // Separate email subscription trigger function
  const handleSubscribeClick = () => {
    // Use type assertion to access Mailchimp objects safely
    const win = window as any;
    
    if (win.mcpopup) {
      win.mcpopup.open();
    } else if (win.mc4wp) {
      win.mc4wp.forms.show();
    } else {
      console.warn("Mailchimp popup not ready yet");
      alert("Email subscription feature is loading, please try again later");
    }
  };

  return (
    <div className="mt-6 w-full">
      {/* Email subscription button - placed above table */}
      <div className="mb-4 text-center">
        <button
          onClick={handleSubscribeClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          📧 Subscribe to Updates
        </button>
        <p className="text-sm text-gray-600 mt-1">
          Get notified about new recordings
        </p>
      </div>

      <div className="border border-gray-200 rounded-2xl p-4 shadow-md w-full">
        <h3 className="text-xl font-semibold text-gray-800 mb-3 text-left">
          Available Recordings
        </h3>

        <table className="w-full table-auto border-collapse text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Vessel</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Time</th>
              <th className="p-2 border">Noise Level</th>
              <th className="p-2 border">Clip Length</th>
              <th className="p-2 border">Play</th>
              <th className="p-2 border">Download</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((rec, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-2 border">{rec.vessel}</td>
                <td className="p-2 border">
                  <button
                    className="text-blue-600 underline cursor-pointer"
                    onClick={() => onLocationClick(rec.location)}
                  >
                    {rec.location}
                  </button>
                </td>
                <td className="p-2 border">{rec.date}</td>
                <td className="p-2 border">{rec.time}</td>
                <td className="p-2 border">{rec.noiseLevel}</td>
                <td className="p-2 border">{rec.clipLength}</td>
                <td className="p-2 border w-24">
                  {/* Fixed play button - now actually plays audio */}
                  <button
                    onClick={() => handlePlayClick(rec.recordUrl)}
                    className="text-black hover:text-green-600 p-2"
                    title="Play recording"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </td>
                <td className="p-2 border w-24">
                  <a
                    href={rec.recordUrl}
                    download
                    className="text-black hover:text-blue-600 p-2 flex justify-center items-center"
                    title="Download recording"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M5 20h14v-2H5v2z" />
                      <path
                        d="M12 2v12m0 0l-4-4m4 4l4-4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <span>
            Showing {indexOfFirst + 1} - {indexOfFirst + currentRecords.length} of{" "}
            {recordings.length} records
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 disabled:opacity-50"
            >
              ◀
            </button>

            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx + 1}
                onClick={() => paginate(idx + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded ${
                  currentPage === idx + 1
                    ? "bg-black text-white"
                    : "bg-white border border-gray-300 text-black hover:bg-gray-100"
                }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 disabled:opacity-50"
            >
              ▶
            </button>
          </div>
        </div>
      </div>

      {/* Debug information */}
      <div className="mt-4 p-3 bg-gray-100 rounded text-sm text-gray-600">
        <p><strong>Debug Info:</strong></p>
        <p>• Mailchimp script loaded: {document.getElementById("mcjs") ? "✅" : "❌"}</p>
        <p>• If email subscription doesn't work, check browser console for errors</p>
        <p>• Make sure Connected Sites is configured in your Mailchimp dashboard</p>
        
        <button
          onClick={() => {
            const win = window as any;
            console.log('All window properties with "mc":', Object.keys(win).filter(key => key.toLowerCase().includes('mc')));
            const hasPopup = !!win.mcpopup;
            const hasMc4wp = !!win.mc4wp;
            const hasMailChimp = !!win.MailChimp;
            alert(`Debug: mcpopup=${hasPopup}, mc4wp=${hasMc4wp}, MailChimp=${hasMailChimp}`);
          }}
          className="mt-2 bg-gray-500 text-white px-3 py-1 rounded text-xs"
        >
          Debug Mailchimp Objects
        </button>
      </div>
    </div>
  );
};

export default AvailableRecordings;




