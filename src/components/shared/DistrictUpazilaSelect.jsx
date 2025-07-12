import React, { useEffect, useState } from "react";

const DistrictUpazilaSelect = ({
  selectedDistrictId,
  setSelectedDistrictId,
  upazila,
  setUpazila,
  requiredDistrict,
  requiredUpazila,
}) => {
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);

  // Load districts on mount
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await fetch("/data/districts.json");
        const data = await res.json();
        setDistricts(data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        console.error("Failed to load districts:", err);
      }
    };
    fetchDistricts();
  }, []);

  // Load upazilas when district changes
  useEffect(() => {
    const fetchUpazilas = async () => {
      if (!selectedDistrictId) {
        setUpazilas([]);
        return;
      }

      try {
        const res = await fetch("/data/upazilas.json");
        const data = await res.json();
        const filtered = data
          .filter((u) => String(u.district_id) === String(selectedDistrictId))
          .map((u) => u.name)
          .sort((a, b) => a.localeCompare(b));
        setUpazilas(filtered);
      } catch (err) {
        console.error("Failed to load upazilas:", err);
        setUpazilas([]);
      }
    };

    fetchUpazilas();
  }, [selectedDistrictId]);

  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      {/* District Selection */}
      <div>
        <label htmlFor="district" className="block label text-primary">
          District
        </label>

        <select
          id="district"
          value={selectedDistrictId || ""}
          required={requiredDistrict}
          onChange={(e) => {
            setSelectedDistrictId(e.target.value);
            setUpazila(""); // Reset selected upazila
          }}
          className="input border-none w-full shadow-none text-secondary/80 focus:outline-primary/40 bg-primary/10 cursor-pointer"
        >
          <option value="">Select District</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Upazila Selection */}
      <div>
        <label htmlFor="upazila" className="block label text-primary">
          Upazila
        </label>
        <select
          id="upazila"
          value={upazila || ""}
          required={requiredUpazila}
          onChange={(e) => setUpazila(e.target.value)}
          disabled={!selectedDistrictId}
          className="input border-none w-full shadow-none text-secondary/80 focus:outline-primary/40 bg-primary/10 cursor-pointer"
        >
          <option value="">Select Upazila</option>
          {upazilas.map((u, idx) => (
            <option key={idx} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DistrictUpazilaSelect;
