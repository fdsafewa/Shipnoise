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
}

const MAILCHIMP_SCRIPT =
  "const MAILCHIMP_SCRIPT =
  "https://chimpstatic.com/mcjs-connected/js/users/30e5b89b891e7b961c63e7d39/2318c630b0adc777855362be3.js";

const AvailableRecordings: React.FC<AvailableRecordingsProps> = ({
  recordings,
  onLocationClick,
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
      script.src = MAILCHIMP_SCRIPT;
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  // Play button click handler
  const handlePlayClick = () => {
    if (window.mcpopup) {
      window.mcpopup.open();
    } else {
      console.warn("Mailchimp popup not ready yet");
    }
  };
  

  return (
    <div className="mt-6 w-full">
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
                  <button
                    onClick={handlePlayClick}
                    className="text-black hover:text-green-600 p-2"
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
    </div>
  );
};

export default AvailableRecordings;




