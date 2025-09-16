import React, { useState, useEffect } from "react";
import VesselIcon from "../assets/VesselIcon.png"

type Recording = {
  vessel: string;
  location: string;
  date: string;
  time: string;
  recordUrl: string;
};

interface AvailableRecordingsProps {
  recordings: Recording[];
  onLocationClick: (location: string) => void;
  onPlay?: (url: string) => void;
}

// Extend Window interface for Mailchimp objects
declare global {
  interface Window {
    mcpopup?: { open: () => void };
    mc4wp?: { forms: { show: () => void } };
  }
}

const MAILCHIMP_SCRIPT =
  "https://chimpstatic.com/mcjs-connected/js/users/30e5b89b891e7b961c63e7d39/2318c630b0adc777855362be3.js";

const AvailableRecordings: React.FC<AvailableRecordingsProps> = ({
  recordings,
  onLocationClick,
  onPlay,
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
    document.querySelectorAll('script[src*="chimpstatic"]').forEach(s => s.remove());
  
    const script = document.createElement("script");
    script.id = "mcjs";
    script.src = MAILCHIMP_SCRIPT + "?v=" + new Date().getTime();
    script.async = true;
    document.body.appendChild(script);
  }, []);
  
  // Play button click handler
  const handlePlayClick = (recordUrl: string) => {
    if (onPlay) {
      onPlay(recordUrl);
    } else {
      const audio = new Audio(recordUrl);
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
        alert("Unable to play audio file");
      });
    }
  };

  return (
    <div className="mt-6 w-full">
      {/* Container for table and header */}
      <div className="w-full">
        {/* Header with background color */}
        <div
          className="w-full p-3 flex items-center"
          style={{ backgroundColor: "#2D3147", height: "51px" }}
        >
          <img src={VesselIcon} alt="icon" className="mr-2 w-6 h-6" />
          <h3 className="text-xl font-semibold text-white mb-0 text-left">
            Vessel Monitoring Data
          </h3>
        </div>

        {/* Table */}
        <table className="w-full table-auto border-collapse text-center">
          <thead>
            <tr
              className="bg-[#E5E7EB] h-[46px]"
              style={{ borderBottom: "1px solid #52525B" }} // Header bottom line
            >
              <th className="p-2 text-left text-[14px] font-normal">Vessel ID</th>
              <th className="p-2 text-left text-[14px] font-normal">Hydrophone Location</th>
              <th className="p-2 text-left text-[14px] font-normal ">Date</th>
              <th className="p-2 text-left text-[14px] font-normal ">Time</th>
              <th className="p-2 text-left text-[14px] font-normal ">Recording</th>
              <th className="p-2 text-center text-[14px] font-normal">Download</th>
            </tr>
          </thead>

          <tbody>
            {currentRecords.map((rec, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50"
                style={{ borderBottom: "1px solid #52525B" }} // Row horizontal line
              >
                <td className="p-2 text-left font-semibold text-[14px] text-gray-600">{rec.vessel}</td>
                <td className="p-2 text-left font-semibold text-[14px]">
                  <button
                    className="text-blue-600 underline cursor-pointer"
                    onClick={() => onLocationClick(rec.location)}
                  >
                    {rec.location}
                  </button>
                </td>
                <td className="p-2 text-left font-semibold text-[14px] text-[#716E6E]">{rec.date}</td>
                <td className="p-2 text-left font-semibold text-[14px] text-[#716E6E]">{rec.time}</td>
                <td className="p-2 w-24 text-left font-semibold text-[14px]">
                  <button
                    onClick={() => handlePlayClick(rec.recordUrl)}
                    className="w-7 h-7 flex items-center justify-center rounded-full"
                    style={{ backgroundColor: "#013C74" }}
                  >
                       <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
                  </button>
                </td>
                <td className="p-2 w-24 text-center">
                  <a
                    href={rec.recordUrl}
                    download
                    className="text-black p-2 flex justify-center items-center"
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
        <div className="flex justify-between items-center text-sm text-[#4B5563] bg-[#F9FAFB] h-[51px] px-4">
          {/* Records info */}
          <span>
            Showing {indexOfFirst + 1} - {indexOfFirst + currentRecords.length} of{" "}
            {recordings.length} records
          </span>

          {/* Pagination buttons */}
          <div className="flex items-center space-x-2">
            {/* Previous button */}
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 disabled:opacity-100 flex items-center bg-[#E5E7EB] text-[#4B5563]"
            >
              <span>&lt;</span> Previous
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx + 1}
                onClick={() => paginate(idx + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded ${
                  currentPage === idx + 1
                    ? "bg-black text-white"
                    : "bg-white border border-gray-300 text-black"
                }`}
                style={{
                  backgroundColor: currentPage === idx + 1 ? "#013C74" : undefined,
                }}
              >
                {idx + 1}
              </button>
            ))}

            {/* Next button */}
            <button
  onClick={() => paginate(currentPage + 1)}
  disabled={currentPage === totalPages}
  className="p-2 disabled:opacity-100 flex items-center bg-[#E5E7EB] text-[#4B5563]"
>
  Next <span className="ml-1">&gt;</span>
</button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableRecordings;






