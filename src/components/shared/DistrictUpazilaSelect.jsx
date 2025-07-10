// components/shared/DistrictUpazilaSelect.jsx
import React, { useEffect, useState } from "react";

const DistrictUpazilaSelect = ({
  selectedDistrictId,
  setSelectedDistrictId,
  upazila,
  setUpazila,
  editable,
}) => {
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);

  useEffect(() => {
    fetch("/data/districts.json")
      .then((res) => res.json())
      .then((data) =>
        setDistricts(data.sort((a, b) => a.name.localeCompare(b.name)))
      );
  }, []);

  useEffect(() => {
    if (!selectedDistrictId) return setUpazilas([]);
    fetch("/data/upazilas.json")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data
          .filter((u) => u.district_id === selectedDistrictId)
          .map((u) => u.name)
          .sort((a, b) => a.localeCompare(b));
        setUpazilas(filtered);
      });
  }, [selectedDistrictId]);

  return (
    <>
      {/* District */}
      <div>
        <label className="block text-sm font-medium">District</label>
        <select
          value={selectedDistrictId || ""}
          onChange={(e) => {
            setSelectedDistrictId(e.target.value);
            setUpazila(""); // reset upazila
          }}
          disabled={!editable}
          className="w-full input input-bordered"
        >
          <option value="">Select District</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Upazila */}
      <div>
        <label className="block text-sm font-medium">Upazila</label>
        <select
          value={upazila || ""}
          onChange={(e) => setUpazila(e.target.value)}
          disabled={!editable || !selectedDistrictId}
          className="w-full input input-bordered"
        >
          <option value="">Select Upazila</option>
          {upazilas.map((u, idx) => (
            <option key={idx} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default DistrictUpazilaSelect;
