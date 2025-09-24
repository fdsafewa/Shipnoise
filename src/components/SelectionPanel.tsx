import React, { useState } from 'react';
import AudioWavePlayer from './AudioWavePlayer';
import AvailableRecordings from './AvailableRecordings';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type VesselOption = {
  name: string;
  description?: string;
};


interface VesselInputProps {
  options: VesselOption[];
  onChange: (option: VesselOption) => void;
  placeholder: string;
}


interface LocationModalProps {
  location: string | null;
  onClose: () => void;
}

// AutoComplete input for Vessel
const VesselInput: React.FC<VesselInputProps> = ({ options, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<VesselOption[]>([]);
  const [showOptions, setShowOptions] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (val.length > 0) {
      const filtered = options.filter((opt: VesselOption) =>
        opt.name.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredOptions(filtered);
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
  };

  const handleSelect = (option: VesselOption) => {
    setInputValue(option.name);
    setShowOptions(false);
    onChange(option);
  };
  return (
    <div className="relative w-full h-full">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full h-full px-5 border border-gray-300 rounded-[4px] focus:outline-none focus:border-[#111827] text-left placeholder:text-left"
      />
      {showOptions && filteredOptions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 border border-gray-300 rounded-[4px] max-h-48 overflow-y-auto z-10 shadow-lg bg-white">
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


// Location Modal
const LocationModal: React.FC<LocationModalProps> = ({ location, onClose }) => {
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
  const [selectedVessel, setSelectedVessel] = useState<VesselOption | null>(null);
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
      date: 'Sep 9, 2025',
      time: '12:30 PST',
      clipLength: '25s',
      location: 'Orcasound Live',
      noiseLevel: '90 dB',
      recordUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Easy%20Lemon%2030%20second.mp3',
    },
    {
      vessel: 'Oil Tanker',
      date: 'Sep 8, 2025',
      time: '14:00 PST',
      clipLength: '22s',
      location: 'Port Townsend',
      noiseLevel: '90 dB',
      recordUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Easy%20Lemon%2030%20second.mp3',
    },
    {
      vessel: 'Cruise Ship',
      date: 'Sep 7, 2025',
      time: '09:45 PST',
      clipLength: '28s',
      location: 'Sunset Bay',
      noiseLevel: '90 dB',
      recordUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Easy%20Lemon%2030%20second.mp3',
    },
  ];

  const handleSearchClick = () => {
    const vesselLabel = selectedVessel?.name ?? '';

    window.gtag?.('event', 'vessel_search', {
      event_category: 'selection_panel',
      event_label: vesselLabel,
      vessel: vesselLabel,
    });

    setShowRecordings(true);
  };

  return (
    <div className="min-h-screen bg-white w-full">
      <div className="w-full px-4 pt-[30px] pb-[30px]">
      <div className="max-w-[1300px] mx-auto flex flex-col gap-[30px]">
          {/* Search Inputs */}
          <div className="flex justify-center">
            <div
              className="w-[520px] h-[200px] border-2 border-gray-200 rounded-[8px] flex flex-col"
              style={{ padding: '25px' }}
            >
              <div
                className="w-[470px] h-[56px]"
                style={{ marginBottom: '15px' }}
              >
                <div
                  className="text-[18px] text-left font-semibold"
                  style={{ color: '#111827' }}
                >
                  Search Vessel Noise Data
                </div>
                <p className="mt-1 text-[14px] text-left" style={{ color: '#9CA3AF' }}>
                  Enter search criteria to find acoustic recordings from vessels
                </p>
              </div>

              <div className="flex items-end gap-4" style={{ marginTop: '15px' }}>
                {/* Vessel container */}
                <div className="w-[280px] flex flex-col gap-2">
                  <span className="w-[68px] h-[20px] text-[14px] font-medium" style={{ color: '#374151' }}>
                    Vessel ID
                  </span>
                  <div className="h-[40px]">
                    <VesselInput
                      options={vesselOptions}
                      onChange={setSelectedVessel}
                      placeholder="Enter vessel ID"
                    />
                  </div>
                </div>

                {/* Search button */}
                <div className="w-[170px] h-[40px]">
                  <button
                    onClick={handleSearchClick}
                    className="w-full h-full flex items-center justify-center bg-[#013C74] text-white rounded-none transition"
                  >
                    Search
                  </button>
                </div>
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

