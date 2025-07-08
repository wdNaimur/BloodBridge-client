import axios from "axios";

const uploadImageToImgBB = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_IMGBB_API_KEY
      }`,
      formData
    );
    return response?.data?.data?.url || null;
  } catch (error) {
    console.error("Image upload failed:", error);
    return null;
  }
};

export default uploadImageToImgBB;
