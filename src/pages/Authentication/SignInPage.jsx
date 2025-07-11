import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import ScrollFadeIn from "../../UI/ScrollFadeIn";
import GoogleSignInButton from "./GoogleSignInButton";
import saveUserInDB from "../../utils/saveUserInDB";
import FeedbackMessage from "../../UI/FeedbackMessage ";

const SignInPage = () => {
  const { userSignIn, user } = useAuth();
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

  useEffect(() => {
    document.title = `BloodBridge | ${user?.email ? "Signed In" : "Sign In"}`;
    window.scrollTo(0, 0);
  }, [user?.email]);

  useEffect(() => {
    if (fromPrivateRoute && !user) {
      toast.error("You must be signed in to view this page.");
      setFromPrivateRoute(false);
    }
  }, [fromPrivateRoute, user]);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      setUserCreateLoading(true);
      const result = await userSignIn(email, password);
      toast.success("Login Successful");
      const userData = {
        name: result?.user?.displayName,
        email: result?.user?.email,
        image: result?.user?.photoURL,
      };
      navigate(from, { replace: true });
      await saveUserInDB(userData);
    } catch (error) {
      setError(error.code);
      toast.error("Login Failed");
    } finally {
      setUserCreateLoading(false);
    }
  };
  if (user) {
    return (
      <FeedbackMessage
        title={`Welcome Back! ${user.displayName}🎉`}
        message={`You’re already logged in and good to go.`}
      />
    );
  }
  return (
    <ScrollFadeIn>
      <div className="container mx-auto px-4 flex justify-center select-none my-10 font-poppins">
        <div className="card bg-base-200 w-full max-w-sm shrink-0 shadow-primary/5 shadow-xl border-2 border-primary/10">
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

              <div className="pt-5 border-secondary/40 border-t-2 border-dashed mt-4">
                <GoogleSignInButton />
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
      </div>
    </ScrollFadeIn>
  );
};

export default SignInPage;
