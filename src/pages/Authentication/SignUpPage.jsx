import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { motion, useInView } from "framer-motion";
import useAuth from "../../hooks/useAuth";

const SignUpPage = () => {
  const { createUser, setUser, updateUser, googleSignIn, user } = useAuth();
  const [userCreateLoading, setUserCreateLoading] = useState(false);
  useEffect(() => {
    document.title = `BloodBridge | ${user?.email ? "Signed Up" : "Sign Up"}`;
    window.scrollTo(0, 0);
  }, [user?.email]);

  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "0px 0px -40px 0px",
  });

  const [nameError, setNameError] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPasswordRules, setShowPasswordRules] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const validatePassword = (password) => ({
    lengthValid: password.length >= 8 && password.length <= 16,
    hasLower: /[a-z]/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  });

  const handleSignUp = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const url = form.url.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (name.length < 5) {
      setNameError("Name should be more than 5 characters");
      form.name.focus();
      return;
    } else {
      setNameError("");
    }

    const checks = validatePassword(password);
    if (
      !checks.lengthValid ||
      !checks.hasLower ||
      !checks.hasUpper ||
      !checks.hasNumber ||
      !checks.hasSpecial
    ) {
      setErrorPassword("Password must fulfill all requirements.");
      return;
    } else {
      setErrorPassword("");
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match!");
      form.confirmPassword.focus();
      return;
    } else {
      setConfirmPasswordError("");
    }

    try {
      setUserCreateLoading(true);
      const res = await createUser(email, password);
      const createdUser = res.user;
      navigate(from);
      try {
        await updateUser({
          displayName: name,
          photoURL: url,
        });
        setUser({ ...createdUser, displayName: name, photoURL: url });
        toast.success("Successfully Created Account!");
      } catch (updateErr) {
        console.error("Profile update failed:", updateErr);
        setUser(createdUser);
        toast.error("Account created, but failed to update profile.");
      }

      form.reset();
      setPasswordInput("");
      setShowPasswordRules(false);
      setUserCreateLoading(false);
    } catch (err) {
      console.error("Create user failed:", err);
      toast.error("Failed to create account. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await googleSignIn();
      if (result?.user) {
        toast.success("Successfully Signed In with Google!");
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error("Google Sign-In failed:", err);
      toast.error("Failed to Sign In with Google.");
    }
  };

  const passwordChecks = validatePassword(passwordInput);

  if (user) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40, filter: "blur(6px)", scale: 0.9 }}
        animate={
          isInView ? { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 } : {}
        }
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="container mx-auto px-4 font-poppins"
      >
        <div className="p-10 space-y-2 my-10 rounded-box bg-base-100">
          <h1 className="text-4xl font-grand-hotel text-center text-primary">
            Please Logout First
          </h1>
          <p className="text-center opacity-80">
            You are already logged in. To create a new account, please logout
            first.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: "blur(6px)", scale: 0.9 }}
      animate={
        isInView ? { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 } : {}
      }
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="container mx-auto px-4 flex gap-10 items-center justify-center select-none my-10 font-poppins"
    >
      <div className="card bg-base-100 w-full max-w-sm shadow-2xl border-2 border-primary/10">
        <div className="card-body">
          <h2 className="text-4xl font-bold lg:text-5xl text-primary">
            Sign Up
          </h2>
          <form onSubmit={handleSignUp} className="fieldset">
            {/* Name */}
            <label className="label text-primary">Name</label>
            <input
              name="name"
              type="text"
              className="input border-none bg-primary/10 w-full focus:outline-primary/40"
              placeholder="Name"
              required
            />
            {nameError && <p className="text-sm text-red-500">{nameError}</p>}

            {/* Photo URL */}
            <label className="label text-primary">Photo URL</label>
            <input
              name="url"
              type="url"
              className="input border-none bg-primary/10 w-full focus:outline-primary/40"
              placeholder="Photo URL"
              required
            />

            {/* Email */}
            <label className="label text-primary">Email</label>
            <input
              name="email"
              type="email"
              className="input border-none bg-primary/10 w-full focus:outline-primary/40"
              placeholder="Email"
              required
            />

            {/* Password */}
            <label className="label text-primary">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className="input border-none bg-primary/10 w-full focus:outline-primary/40"
                placeholder="Password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setShowPasswordRules(true);
                  setErrorPassword("");
                }}
              />
              <button
                type="button"
                onClick={handleTogglePassword}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            {/* Password Rules */}
            {showPasswordRules && (
              <div className="text-xs mt-1 ml-1 text-left text-red-500">
                {!passwordChecks.lengthValid && (
                  <p>✗ Password must be 8–16 characters</p>
                )}
                {passwordChecks.lengthValid && !passwordChecks.hasLower && (
                  <p>✗ Must include a lowercase letter</p>
                )}
                {passwordChecks.lengthValid &&
                  passwordChecks.hasLower &&
                  !passwordChecks.hasUpper && (
                    <p>✗ Must include an uppercase letter</p>
                  )}
                {passwordChecks.lengthValid &&
                  passwordChecks.hasLower &&
                  passwordChecks.hasUpper &&
                  !passwordChecks.hasNumber && <p>✗ Must include a number</p>}
                {passwordChecks.lengthValid &&
                  passwordChecks.hasLower &&
                  passwordChecks.hasUpper &&
                  passwordChecks.hasNumber &&
                  !passwordChecks.hasSpecial && (
                    <p>✗ Must include a special character</p>
                  )}
              </div>
            )}
            {errorPassword && (
              <p className="text-sm text-red-500 mt-1">{errorPassword}</p>
            )}

            {/* Confirm Password */}
            <label className="label text-primary">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              className="input border-none bg-primary/10 w-full focus:outline-primary/40"
              placeholder="Confirm Password"
              required
            />
            {confirmPasswordError && (
              <p className="text-sm text-red-500 mt-1">
                {confirmPasswordError}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-secondary mt-4 text-base-100 w-full"
              disabled={userCreateLoading}
            >
              {userCreateLoading ? "Signing Up..." : "Sign Up"}
            </button>

            {/* Google Sign-In */}
            <div className="pt-5 border-secondary/40 border-t-2 border-dashed mt-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="btn bg-white text-black border-primary/15 shadow-sm shadow-primary/15 w-full"
              >
                <svg
                  aria-label="Google logo"
                  width="16"
                  height="16"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <g>
                    <path d="m0 0H512V512H0" fill="#fff"></path>
                    <path
                      fill="#34a853"
                      d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                    ></path>
                    <path
                      fill="#4285f4"
                      d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                    ></path>
                    <path
                      fill="#fbbc02"
                      d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                    ></path>
                    <path
                      fill="#ea4335"
                      d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                    ></path>
                  </g>
                </svg>
                Sign In with Google
              </button>
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
    </motion.div>
  );
};

export default SignUpPage;
