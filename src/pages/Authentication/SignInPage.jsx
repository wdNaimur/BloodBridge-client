import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { motion, useInView } from "framer-motion";
import useAuth from "../../hooks/useAuth";

const SignInPage = () => {
  const { userSignIn, googleSignIn, user } = useAuth();
  useEffect(() => {
    document.title = `BloodBridge | ${user?.email ? "Signed In" : "Sign In"}`;
    window.scrollTo(0, 0);
  }, [user?.email]);
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from || "/";
  const initialFromPrivateRoute = location.state?.fromPrivateRoute;
  const [fromPrivateRoute, setFromPrivateRoute] = useState(
    initialFromPrivateRoute
  );
  const [userCreateLoading, setUserCreateLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");

  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "0px 0px -40px 0px",
  });

  useEffect(() => {
    if (fromPrivateRoute && !user) {
      toast.error("You must be signed in to view this page.");
      setFromPrivateRoute(false);
    }
  }, [fromPrivateRoute, user]);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    setUserCreateLoading(true);
    userSignIn(email, password)
      .then((userCredential) => {
        setFromPrivateRoute(false);
        toast.success("Login Successful");
        setUserCreateLoading(false);
        navigate(from, { replace: true });
      })
      .catch((error) => {
        const errorCode = error.code;
        setUserCreateLoading(false);
        setError(errorCode);
        toast.error("Login Failed");
      });
  };

  const handleGoogleSignIn = () => {
    googleSignIn()
      .then((res) => {
        setFromPrivateRoute(false);
        toast.success("Login Successful");
        navigate(from, { replace: true });
      })
      .catch(() => {
        toast.error("Login Failed");
      });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: "blur(6px)", scale: 0.9 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }
          : { opacity: 0, y: 40, filter: "blur(6px)", scale: 0.9 }
      }
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="container mx-auto px-4 flex justify-center select-none my-10 font-poppins"
    >
      {user?.email ? (
        <div className="container mx-auto px-4 font-poppins">
          <div className="p-10 space-y-2 my-10 rounded-box bg-base-100">
            <h1 className="text-4xl font-grand-hotel text-center text-primary">
              Please Logout First
            </h1>
            <p className="text-center  mx-auto opacity-80">
              You are already logged in. To log in with a different account,
              please logout first.
            </p>
          </div>
        </div>
      ) : (
        <div className="card bg-base-200 w-full max-w-sm shrink-0 shadow-2xl shadow-primary/10  border-2 border-primary/10">
          <div className="card-body">
            <h2 className="text-4xl font-bold lg:text-5xl text-primary">
              Sign In
            </h2>
            <form onSubmit={handleSignIn} className="fieldset">
              <label className="label text-primary">Email</label>
              <input
                name="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="input border-none bg-primary/10 w-full focus:outline-primary/40"
                placeholder="Email"
              />

              <label className="label text-primary">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="input border-none bg-primary/10 w-full focus:outline-primary/40"
                  placeholder="Password"
                />
                <span
                  onClick={handleTogglePassword}
                  className="absolute right-4 cursor-pointer top-1/2 z-50 -translate-y-[50%]"
                >
                  {showPassword ? (
                    <FaEye size={18} />
                  ) : (
                    <FaEyeSlash size={18} />
                  )}
                </span>
              </div>

              {error && <p className="text-red-700">{error}</p>}

              <Link
                state={{ state: { email } }}
                className="link link-hover text-primary"
              >
                Forgot password?
              </Link>

              <button
                type="submit"
                className="btn btn-secondary mt-4 text-base-100"
                disabled={userCreateLoading}
              >
                {userCreateLoading ? "Signing In..." : "Sign In"}
              </button>

              <div className="pt-5 border-secondary/40 border-t-2 border-dashed mt-4 ">
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
                  Don't have an account?{" "}
                  <Link
                    state={{ from }}
                    to="/signUp"
                    className="link link-hover text-primary font-semibold"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SignInPage;
