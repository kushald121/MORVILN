"use client";
import { useEffect, useState, useRef } from "react";

export default function CountryDropdown({ onSelect }) {
  const [countries, setCountries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Fetch countries
  useEffect(() => {
    async function fetchCountries() {
      try {
        const res = await fetch("https://www.apicountries.com/countries");
        const data = await res.json();
        const formatted = data
          .map((c) => ({
            name: c.name,
            code: c.alpha2Code,
            flagSvg: c.flags.svg,
            flagPng: c.flags.png,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(formatted);
        const defaultCountry = formatted.find((c) => c.code === "IN");
        setSelected(defaultCountry ?? formatted[0]);
      } catch (err) {
        console.error("Failed to load countries", err);
      }
    }
    fetchCountries();
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (country) => {
    setSelected(country);
    setOpen(false);
    if (onSelect) onSelect(country);
  };

  return (
    <div className="relative w-56" ref={containerRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full px-3 py-2 border rounded-md bg-white hover:bg-gray-100"
      >
        {selected ? (
          <div className="flex items-center gap-2">
            <img
              src={selected.flagSvg}
              alt={selected.name}
              className="w-5 h-5 rounded-sm"
            />
            <span className="text-sm font-medium">{selected.name}</span>
          </div>
        ) : (
          <span className="text-sm">Select Country</span>
        )}

        <span className="ml-2 text-sm">▾</span>
      </button>

      {open && (
        <div className="absolute mt-2 w-full max-h-64 overflow-y-auto bg-white border rounded-md shadow-lg z-50">
          {countries.map((c) => (
            <button
              key={c.code}
              onClick={() => handleSelect(c)}
              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-100 text-left"
            >
              <img
                src={c.flagSvg}
                alt={c.name}
                className="w-6 h-6 rounded-sm"
              />
              <span className="text-sm">{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}