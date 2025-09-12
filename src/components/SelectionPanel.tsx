import React, { useState } from 'react';
import AudioWavePlayer from './AudioWavePlayer';
import AvailableRecordings from './AvailableRecordings';

// AutoComplete input for Vessel
const VesselInput = ({ options, value, onChange, placeholder }: any) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<any[]>([]);
  const [showOptions, setShowOptions] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (val.length > 0) {
      const filtered = options.filter((opt: any) =>
        opt.name.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredOptions(filtered);
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
  };

  const handleSelect = (option: any) => {
    setInputValue(option.name);
    setShowOptions(false);
    onChange(option);
  };

  return (
    <div className="relative w-full">
      <label className="text-l font-semibold text-gray-800 mb-2 block text-left">{placeholder}</label>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
      />
      {showOptions && filteredOptions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 border border-gray-300 rounded-lg max-h-48 overflow-y-auto z-10 shadow-lg bg-white">
          {filteredOptions.map((opt, idx) => (
            <div
              key={idx}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(opt)}
            >
              <div className="font-medium text-gray-800">{opt.name}</div>
              {opt.description && <div className="text-sm text-gray-500 mt-1">{opt.description}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Date input supporting exact date or just month
const DateInput = ({ date, onChange }: any) => {
  const [specificDay, setSpecificDay] = useState(true); 

  const handleExactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ type: 'exact', value: e.target.value });
  };
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ type: 'month', value: e.target.value });
  };

  return (
    <div className="relative w-full">
    <label className="text-l font-semibold text-gray-800 mb-2 block text-left">Date</label>
  
    {/* Date input with toggle */}
    <div className="relative">
      <input
        type={specificDay ? 'date' : 'month'}
        value={specificDay ? date.value : date.monthValue}
        onChange={specificDay ? handleExactChange : handleMonthChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
      />
  
      {/* Toggle in the top-right corner */}
      <div className="absolute -top-5 right-1 flex items-center space-x-1 bg-white px-2 rounded">
        <input
          type="checkbox"
          checked={specificDay}
          onChange={() => setSpecificDay(!specificDay)}
          className="w-4 h-4"
        />
        <span className="text-xs text-gray-600">Specific Day</span>
      </div>
    </div>
  </div>
  

  );
};

// Location Modal
const LocationModal = ({ location, onClose }: any) => {
  if (!location) return null;

  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-[500px] max-w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="text-lg font-semibold mb-2">{location}</h3>
        <iframe
          title="map"
          src={mapUrl}
          width="100%"
          height="300"
          className="border rounded"
        ></iframe>
      </div>
    </div>
  );
};

// Main Selection Panel
const SelectionPanel = () => {
  const [selectedVessel, setSelectedVessel] = useState<any>('');
  const [selectedDate, setSelectedDate] = useState<any>({ type: 'exact', value: '' });
  const [showRecordings, setShowRecordings] = useState(false);
  const [modalLocation, setModalLocation] = useState<string | null>(null);
  const [playingClip, setPlayingClip] = useState<string | null>(null);

  const vesselOptions = [
    { name: 'Container Ship', description: 'Large cargo vessel for containers' },
    { name: 'Oil Tanker', description: 'Ship designed to transport oil' },
    { name: 'Cruise Ship', description: 'Passenger vessel for tourism' },
    { name: 'Fishing Vessel', description: 'Commercial fishing boat' },
    { name: 'Naval Ship', description: 'Military naval vessel' },
    { name: 'Research Vessel', description: 'Scientific research ship' },
  ];

  const sampleRecordings = [
    {
      vessel: 'Container Ship',
      date: 'September 9, 2025',
      time: '12:30(PST)',
      clipLength: '25s',
      location: 'Orcasound Live',
      noiseLevel: '90 dB',
      recordUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Easy%20Lemon%2030%20second.mp3',
    },
    {
      vessel: 'Oil Tanker',
      date: 'September 8, 2025',
      time: '14:00(PST)',
      clipLength: '22s',
      location: 'Port Townsend',
      noiseLevel: '90 dB',
      recordUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Easy%20Lemon%2030%20second.mp3',
    },
    {
      vessel: 'Cruise Ship',
      date: 'September 7, 2025',
      time: '09:45(PST)',
      clipLength: '28s',
      location: 'Sunset Bay',
      noiseLevel: '90 dB',
      recordUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Easy%20Lemon%2030%20second.mp3',
    },
  ];

  return (
    <div className="min-h-screen bg-white w-full">
      <div className="w-[1200px] max-w-full mx-auto px-4 py-8">
        {/* Vessel & Date Inputs */}
        <div className="w-full border-2 border-gray-200 rounded-2xl p-4 hover:border-gray-400 hover:shadow-lg transition-all duration-300">
  <label className="text-xl font-semibold text-gray-800 mb-4 block text-left">Search Vessel Noise Data</label>

  <div className="flex flex-wrap gap-8 mt-10">
    {/* Vessel container */}
    <div className="flex-1 min-w-[200px]">
      <VesselInput
        options={vesselOptions}
        value={selectedVessel}
        onChange={setSelectedVessel}
        placeholder="Vessel"
      />
    </div>

    {/* Date container */}
    <div className="flex-1 min-w-[200px]">
      <DateInput date={selectedDate} onChange={setSelectedDate} />
    </div>
     {/* Search container */}
    <div className="mt-4 flex items-center mt-8">
            <button
              onClick={() => setShowRecordings(true)}
              className="flex items-center bg-black text-white px-1 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              {/* Search SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
              Find Recording
            </button>
          </div>
  </div>

</div>


        {/* Recordings Table */}
        {showRecordings && (
          <AvailableRecordings 
            recordings={sampleRecordings} 
            onPlay={(url: string) => setPlayingClip(url)} 
            onLocationClick={(location: string) => setModalLocation(location)} 
          />
        )}

      </div>

      <LocationModal
        location={modalLocation}
        onClose={() => setModalLocation(null)}
      />

      {playingClip && (
        <AudioWavePlayer
          src={playingClip}
          onClose={() => setPlayingClip(null)}
        />
      )}
    </div>
  );
};

export default SelectionPanel;






















