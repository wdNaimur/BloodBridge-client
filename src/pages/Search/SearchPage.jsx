import React, { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import DistrictUpazilaSelect from "../../components/shared/DistrictUpazilaSelect";
import FeedbackMessage from "../../UI/FeedbackMessage ";
import PageHeader from "../../UI/PageHeader";
import { CiSearch } from "react-icons/ci";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const SearchPage = () => {
  const axiosSecure = useAxiosSecure();

  const [formData, setFormData] = useState({
    bloodGroup: "",
    district: "",
    upazila: "",
  });
  const [districtId, setDistrictId] = useState("");
  const [upazila, setUpazila] = useState("");
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialState, setInitialState] = useState(true);
  console.log(donors);
  const handleDistrictChange = (id) => {
    setDistrictId(id);
    setUpazila("");
  };

  const handleUpazilaChange = (value) => {
    setUpazila(value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Reset upazila if district changes
    if (name === "district") {
      setFormData((prev) => ({ ...prev, upazila: "" }));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setInitialState(false);
    setLoading(true);
    setError(null);

    try {
      const params = {
        bloodGroup: formData.bloodGroup,
        district: districtId,
        upazila: upazila,
      };
      const res = await axiosSecure.get("/donors", { params });
      setDonors(res.data || []);
    } catch (err) {
      console.error("Failed to fetch donors:", err);
      setDonors([]);
      setError("Failed to fetch donors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 mt-6">
      <PageHeader
        icon={CiSearch}
        title="Search Blood Donors"
        subtitle="Find eligible donors near your location by blood group and area."
      />

      <form
        onSubmit={handleSearch}
        className="grid md:gap-4 md:grid-cols-3 grid-cols-1"
      >
        <div className="col-span-2 md:mb-0 mb-2">
          <DistrictUpazilaSelect
            selectedDistrictId={districtId}
            setSelectedDistrictId={handleDistrictChange}
            upazila={upazila}
            setUpazila={handleUpazilaChange}
            requiredDistrict={false}
            requiredUpazila={false}
          />
        </div>

        <div className="md:mb-0 mb-4 md:col-span-1 col-span-2">
          <label className="block label text-primary">Blood Group</label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
            className="input border-none w-full shadow-none text-secondary/80 focus:outline-primary/40 bg-primary/10 cursor-pointer"
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn rounded-xl btn-primary uppercase md:col-span-3 text-base-200 shadow-none border-none"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="mt-6">
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}

        {donors.length > 0 ? (
          <div className="grid gap-6 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 grid-cols-1">
            {donors.map((donor) => (
              <div
                key={donor._id}
                className="bg-primary/5 rounded-xl p-5 sm:flex sm:flex-row gap-4 items-center flex-col gap-y-6"
              >
                <img
                  src={donor.image}
                  alt={donor.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold text-primary">
                    {donor.name}
                  </h2>
                  <p className="text-sm text-secondary">
                    <span className="font-medium">Blood Group:</span>{" "}
                    {donor.bloodGroup}
                  </p>
                  <p className="text-sm text-secondary">
                    <span className="font-medium">Location:</span>{" "}
                    {donor.upazila}, {donor.districtName}
                  </p>
                  {donor.phone && (
                    <p className="text-sm text-secondary">
                      <span className="font-medium">Phone:</span> {donor.phone}
                    </p>
                  )}
                  {donor.email && (
                    <p className="text-sm text-secondary">
                      <span className="font-medium">Email:</span> {donor.email}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : !loading && !initialState ? (
          // AFTER SEARCH: No donors found
          <FeedbackMessage
            title="No Donors Found"
            message="We couldn't find any donors matching your criteria. Please try different filters."
          />
        ) : !loading && initialState ? (
          // BEFORE SEARCH: Initial prompt
          <FeedbackMessage
            title="Search for Blood Donors"
            message="Select a blood group and location to find nearby eligible donors."
          />
        ) : null}
      </div>
    </div>
  );
};

export default SearchPage;
