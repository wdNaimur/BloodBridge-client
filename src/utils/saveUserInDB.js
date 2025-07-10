import React from "react";
import axios from "axios";

const saveUserInDB = async (user) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/user`,
    user
  );
  console.log(data);
};

export default saveUserInDB;
