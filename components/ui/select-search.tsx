import React, { useState } from "react";

type Option = { label: string; value: string; region: string };

type CountrySelectProps = {
  options: Option[];
  value: Option;
  onChange: (option: Option) => void;
};

const CountrySelect = ({ options, value, onChange }: CountrySelectProps) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredCountries = options.filter(
    (option) =>
      option.label.toLowerCase().includes(search.toLowerCase()) ||
      option.region.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (country: Option) => {
    onChange(country);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="w-full max-w-md">
      <div className="relative">
        {/* Select Input */}
        <div
          className="border border-solid border-slate-200 w-full border rounded-md p-2 bg-white cursor-pointer flex justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={value ? "text-black" : "text-gray-400"}>
            {value ? value.label : "Select a country"}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto z-10">
            {/* Search Input */}
            <div className="p-2 border-b sticky top-0 bg-white">
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Search countries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Country List */}
            <div className="py-1">
              {filteredCountries.map((country) => (
                <div
                  key={country.value}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                  onClick={() => handleSelect(country)}
                >
                  <span>{country.label}</span>
                  <span className="text-sm text-gray-500">
                    {country.region}
                  </span>
                </div>
              ))}
              {filteredCountries.length === 0 && (
                <div className="px-4 py-2 text-gray-500">
                  No countries found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountrySelect;
