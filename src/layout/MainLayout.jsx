import React from "react";
import Navbar from "../components/shared/Navbar";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";
import useAuth from "../hooks/useAuth";
import Loader from "../UI/Loader";

const MainLayout = () => {
  const { loading } = useAuth();
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="text-secondary bg-base-100 p-5 font-poppins min-h-screen flex flex-col">
      <Toaster />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer>{/* <Footer /> */}</footer>
    </div>
  );
};

export default MainLayout;

// import React from "react";
// import { Outlet } from "react-router";
// import Navbar from "../pages/shared/Navbar";
// import Footer from "../pages/shared/Footer";
// import useAuth from "../hooks/useAuth";
// import { Toaster } from "react-hot-toast";

// const RootLayout = () => {
//   const { loading } = useAuth();
//   if (loading) {
//     return <p>Loading</p>;
//   }

//   return (
//     <div className="text-base-content p-5 font-poppins min-h-screen flex flex-col">
//       <Toaster />
//       <Navbar />
//       <main className="flex-1">
//         <Outlet />
//       </main>
//       <footer>
//         <Footer />
//       </footer>
//     </div>
//   );
// };

// export default RootLayout;
