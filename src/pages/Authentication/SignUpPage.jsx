import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import ScrollFadeIn from "../../UI/ScrollFadeIn";
import uploadImageToImgBB from "../../utils/uploadImageToImgBB";
import GoogleSignInButton from "./GoogleSignInButton";
import saveUserInDB from "../../utils/saveUserInDB";
import FeedbackMessage from "../../UI/FeedbackMessage ";

const SignUpPage = () => {
  const { createUser, setUser, updateUser, user } = useAuth();
  const [userCreateLoading, setUserCreateLoading] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const password = watch("password") || "";
  const confirmPassword = watch("confirmPassword") || "";

  const validatePassword = (password) => ({
    lengthValid: password.length >= 8 && password.length <= 16,
    hasLower: /[a-z]/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  });

  const passwordChecks = validatePassword(password);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  useEffect(() => {
    document.title = `BloodBridge | ${user?.email ? "Signed Up" : "Sign Up"}`;
    window.scrollTo(0, 0);
  }, [user?.email]);

  useEffect(() => {
    fetch("/data/districts.json")
      .then((res) => res.json())
      .then((data) =>
        setDistricts(data.sort((a, b) => a.name.localeCompare(b.name)))
      )
      .catch((err) => console.error("District fetch failed:", err));
  }, []);
  console.log(districts);
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
      })
      .catch((err) => console.error("Upazila fetch failed:", err));
  }, [selectedDistrictId]);

  const onSubmit = async (formData) => {
    const {
      name,
      email,
      password,
      confirmPassword,
      photoUpload,
      district,
      upazila,
      bloodGroup,
    } = formData;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setUserCreateLoading(true);
    try {
      if (!photoUpload || photoUpload.length === 0) {
        toast.error("Please upload a photo.");
        setUserCreateLoading(false);
        return;
      }

      const photoURL = await uploadImageToImgBB(photoUpload[0]);

      if (!photoURL) {
        toast.error("Failed to upload photo");
        setUserCreateLoading(false);
        return;
      }

      const res = await createUser(email, password);
      const createdUser = res.user;
      await updateUser({ displayName: name, photoURL });
      setUser({
        ...createdUser,
        displayName: name,
        photoURL,
      });

      const districtObj = districts.find((d) => d.id === district);
      const districtName = districtObj ? districtObj.name : "Unknown District";
      const userData = {
        name,
        email: email.toLowerCase(),
        image: photoURL,
        districtId: parseInt(district),
        districtName,
        upazila,
        bloodGroup,
      };
      await saveUserInDB(userData);

      toast.success("Account created!");
      navigate(from, { replace: true });
      reset();
    } catch (err) {
      console.error("Signup failed:", err);
      toast.error("Failed to create account");
    } finally {
      setUserCreateLoading(false);
    }
  };

  if (user) {
    return (
      <FeedbackMessage
        title={`Welcome! ${user.displayName || "user"}🎉`}
        message={`You’re already logged in and good to go.`}
      />
    );
  }

  return (
    <ScrollFadeIn>
      <div className="container mx-auto px-4 flex gap-10 items-center justify-center select-none my-10 font-poppins">
        <div className="card bg-base-200 w-full max-w-sm shadow-primary/5 shadow-xl border-2 border-primary/10">
          <div className="card-body">
            <h2 className="text-4xl font-bold lg:text-5xl text-primary">
              Sign Up
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="fieldset">
              <label className="label text-primary">Name</label>
              <input
                {...register("name", { required: true, minLength: 5 })}
                className="input border-none bg-primary/10 w-full focus:outline-primary/40"
                placeholder="Name"
              />
              {errors.name && (
                <p className="text-sm text-red-500">
                  Name must be at least 5 characters
                </p>
              )}

              <label className="label text-primary">Photo</label>
              <input
                type="file"
                {...register("photoUpload", { required: true })}
                className="file-input bg-primary/10 w-full focus:outline-primary/40  border-primary/10"
              />
              {errors.photoUpload && (
                <p className="text-sm text-red-500">Photo is required</p>
              )}

              <label className="label text-primary">Blood Group</label>
              <select
                {...register("bloodGroup", { required: true })}
                className="input bg-primary/10 border-none w-full focus:outline-primary/40 cursor-pointer"
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
              {errors.bloodGroup && (
                <p className="text-sm text-red-500">Blood Group is required</p>
              )}

              <label className="label text-primary">District</label>
              <select
                {...register("district", { required: true })}
                className="input bg-primary/10 border-none w-full focus:outline-primary/40 cursor-pointer"
                onChange={(e) => {
                  setSelectedDistrictId(e.target.value);
                  setValue("district", e.target.value);
                  setValue("upazila", "");
                }}
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className="text-sm text-red-500">District is required</p>
              )}

              <label className="label text-primary">Upazila</label>
              <select
                {...register("upazila", { required: true })}
                className="input bg-primary/10 border-none w-full focus:outline-primary/40 cursor-pointer"
                disabled={!selectedDistrictId}
              >
                <option value="">Select Upazila</option>
                {upazilas.map((u, index) => (
                  <option key={index} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              {errors.upazila && (
                <p className="text-sm text-red-500">Upazila is required</p>
              )}

              <label className="label text-primary">Email</label>
              <input
                {...register("email", { required: true })}
                className="input border-none bg-primary/10 w-full focus:outline-primary/40 lowercase"
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-sm text-red-500">Email is required</p>
              )}

              <label className="label text-primary">Password</label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: true,
                    validate: () =>
                      passwordChecks.lengthValid &&
                      passwordChecks.hasLower &&
                      passwordChecks.hasUpper &&
                      passwordChecks.hasNumber &&
                      passwordChecks.hasSpecial,
                  })}
                  type={showPassword ? "text" : "password"}
                  onFocus={() => setShowPasswordRules(true)}
                  className="input border-none bg-primary/10 w-full focus:outline-primary/40"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {showPasswordRules && (
                <div className="text-xs mt-1 ml-1 text-left text-red-500">
                  {!passwordChecks.lengthValid && <p>✗ 8–16 characters</p>}
                  {passwordChecks.lengthValid && !passwordChecks.hasLower && (
                    <p>✗ At least one lowercase</p>
                  )}
                  {passwordChecks.hasLower && !passwordChecks.hasUpper && (
                    <p>✗ At least one uppercase</p>
                  )}
                  {passwordChecks.hasUpper && !passwordChecks.hasNumber && (
                    <p>✗ At least one number</p>
                  )}
                  {passwordChecks.hasNumber && !passwordChecks.hasSpecial && (
                    <p>✗ At least one special character</p>
                  )}
                </div>
              )}
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  Password must meet all rules
                </p>
              )}

              <label className="label text-primary">Confirm Password</label>
              <input
                {...register("confirmPassword", {
                  required: true,
                  validate: (val) => val === password,
                })}
                type="password"
                className="input border-none bg-primary/10 w-full focus:outline-primary/40"
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  Passwords do not match
                </p>
              )}

              <button
                type="submit"
                className="btn rounded-xl btn-secondary mt-4 text-base-100 w-full"
                disabled={userCreateLoading}
              >
                {userCreateLoading ? "Signing Up..." : "Sign Up"}
              </button>

              <div className="pt-5 border-secondary/40 border-t-2 border-dashed mt-4">
                <GoogleSignInButton />
              </div>

              <div className="text-sm pt-4 text-center">
                <p>
                  Already have an Account?{" "}
                  <Link
                    state={{ from }}
                    to="/signin"
                    className="link link-hover text-primary font-semibold"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ScrollFadeIn>
  );
};

export default SignUpPage;
