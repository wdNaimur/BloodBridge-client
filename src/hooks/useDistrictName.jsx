import { useEffect, useState } from "react";

const useDistrictName = (districtId) => {
  const [districtName, setDistrictName] = useState("");
  useEffect(() => {
    const fetchDistrictName = async () => {
      if (!districtId) return;
      try {
        const res = await fetch("/data/districts.json");
        const districtCollections = await res.json();
        const districtDetails = districtCollections.find(
          (districtDetails) =>
            parseInt(districtDetails.id) === parseInt(districtId)
        );
        setDistrictName(
          districtDetails ? districtDetails.name : "Unknown District"
        );
      } catch (error) {
        console.error("Failed to load district data:", error);
        setDistrictName("Unknown District");
      }
    };

    fetchDistrictName();
  }, [districtId]);

  return districtName;
};

export default useDistrictName;
