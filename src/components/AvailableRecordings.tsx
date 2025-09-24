import React, { useState, useEffect } from "react";
import VesselIcon from "../assets/VesselIcon.png"
import DownloadIcon from "../assets/dl.svg";
import BackIcon from "../assets/back.svg";
import ForwardIcon from "../assets/forward.svg";
import PlayIcon from "../assets/playbutton.svg";

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
    gtag?: (...args: unknown[]) => void;
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
  const handlePlayClick = (record: Recording) => {
    window.gtag?.('event', 'recording_play', {
      event_category: 'recording',
      event_label: record.vessel,
      vessel: record.vessel,
      location: record.location,
      date: record.date,
      time: record.time,
      record_url: record.recordUrl,
    });

    if (onPlay) {
      onPlay(record.recordUrl);
    } else {
      const audio = new Audio(record.recordUrl);
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
          className="w-full px-[25px] py-3 flex items-center"
          style={{ backgroundColor: "#2D3147", height: "51px" }}
        >
          <img src={VesselIcon} alt="icon" className="mr-2 w-5 h-6" />
          <h3 className="text-xl font-semibold text-white mb-0 text-left">
            Vessel Monitoring Data
          </h3>
        </div>

        {/* Table */}
        <table className="w-full table-auto border-collapse text-center">
          <colgroup>
            <col style={{ width: '180px' }} />
            <col style={{ width: '220px' }} />
            <col style={{ width: '260px' }} />
            <col style={{ width: '250px' }} />
            <col style={{ width: '390px' }} />
          </colgroup>
          <thead>
            <tr
              className="bg-[#E5E7EB] h-[46px]"
              style={{ borderBottom: "1px solid #52525B" }} // Header bottom line
            >
              <th className="pl-[25px] pr-2 py-2 text-left text-[14px] font-normal">Vessel ID</th>
              <th className="pl-[25px] pr-2 py-2 text-left text-[14px] font-normal">Hydrophone Location</th>
              <th className="pl-[25px] pr-2 py-2 text-left text-[14px] font-normal">Date</th>
              <th className="pl-[25px] pr-2 py-2 text-left text-[14px] font-normal">Time</th>
              <th className="pl-[25px] pr-2 py-2 text-left text-[14px] font-normal ">Recording</th>
            </tr>
          </thead>

          <tbody>
            {currentRecords.map((rec, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50"
                style={{ borderBottom: "1px solid #52525B" }} // Row horizontal line
              >
                <td className="pl-[25px] pr-2 py-2 text-left font-semibold text-[14px] text-gray-600">{rec.vessel}</td>
                <td className="pl-[25px] pr-2 py-2 text-left font-semibold text-[14px]">
                  <button
                    className="text-blue-600 underline cursor-pointer"
                    onClick={() => onLocationClick(rec.location)}
                  >
                    {rec.location}
                  </button>
                </td>
                <td className="pl-[25px] pr-2 py-2 text-left font-semibold text-[14px] text-[#716E6E]">{rec.date}</td>
                <td className="pl-[25px] pr-2 py-2 text-left font-semibold text-[14px] text-[#716E6E]">{rec.time}</td>
                <td className="pl-[25px] pr-2 py-2 text-left font-semibold text-[14px]">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handlePlayClick(rec)}
                      className="w-7 h-7 flex items-center justify-center rounded-full"
                      style={{ backgroundColor: "#013C74" }}
                    >
                      <img src={PlayIcon} alt="Play" className="w-10 h-10" />
                    </button>
                    <a
                      href={rec.recordUrl}
                      download
                      className="w-7 h-7 flex items-center justify-center"
                      aria-label={`Download recording for ${rec.vessel}`}
                    >
                      <img
                        src={DownloadIcon}
                        alt="Download icon"
                        className="w-[17px] h-[17px] object-contain"
                      />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center text-sm text-[#4B5563] bg-[#F9FAFB] h-[51px] px-[25px]">
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
              className="w-[95px] h-[28px] disabled:opacity-100 flex items-center justify-center bg-[#E5E7EB] text-[#4B5563] gap-1"
            >
              <img src={ForwardIcon} alt="Previous" className="w-3 h-3" />
              Previous
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx + 1}
                onClick={() => paginate(idx + 1)}
                className={`w-[32px] h-[28px] flex items-center justify-center rounded ${
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
              className="w-[70px] h-[28px] disabled:opacity-100 flex items-center justify-center bg-[#E5E7EB] text-[#4B5563] gap-1"
            >
              Next
              <img src={BackIcon} alt="Next" className="w-3 h-3" />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableRecordings;
