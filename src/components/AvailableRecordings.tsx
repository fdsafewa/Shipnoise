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
  onPlay: (url: string) => void;
  onLocationClick: (location: string) => void;
}

interface SubscriptionData {
  name: string;
  email: string;
}

const AvailableRecordings: React.FC<AvailableRecordingsProps> = ({
  recordings,
  onPlay,
  onLocationClick,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionData>({
    name: "",
    email: "",
  });

  const recordsPerPage = 5;
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = recordings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(recordings.length / recordsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  // 点击 Play 弹出 popup
  const handlePlayClick = () => {
    setShowPopup(true);
  };

  // Mailchimp 提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = document.createElement("form");
    form.action =
      "https://YOUR_MAILCHIMP_URL_HERE"; // 替换成你的 Mailchimp 表单 action
    form.method = "POST";
    form.target = "_blank";

    const nameInput = document.createElement("input");
    nameInput.name = "FNAME";
    nameInput.value = subscription.name;

    const emailInput = document.createElement("input");
    emailInput.name = "EMAIL";
    emailInput.value = subscription.email;

    form.appendChild(nameInput);
    form.appendChild(emailInput);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    setShowPopup(false);
    setSubscription({ name: "", email: "" });
  };

  // Mailchimp script
  useEffect(() => {
    const script = document.createElement("script");
    script.id = "mcjs";
    script.src =
      "https://chimpstatic.com/mcjs-connected/js/users/7debdfcc22e25ed8a19fe46bf/b4c5dd27f78ed5aa883612cb5.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">Subscribe to access</h3>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={subscription.name}
                onChange={(e) =>
                  setSubscription({ ...subscription, name: e.target.value })
                }
                className="border p-2 rounded"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={subscription.email}
                onChange={(e) =>
                  setSubscription({ ...subscription, email: e.target.value })
                }
                className="border p-2 rounded"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableRecordings;



