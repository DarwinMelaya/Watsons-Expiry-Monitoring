import axiosInstance from "../lib/axios";

// Get all categories
export const getCategories = async () => {
  const response = await axiosInstance.get("/categories");
  return response.data;
};

// Get single category
export const getCategory = async (id) => {
  const response = await axiosInstance.get(`/categories/${id}`);
  return response.data;
};

// Create category
export const createCategory = async (categoryData) => {
  const response = await axiosInstance.post("/categories", categoryData);
  return response.data;
};

// Update category
export const updateCategory = async (id, categoryData) => {
  const response = await axiosInstance.put(`/categories/${id}`, categoryData);
  return response.data;
};

// Delete category
export const deleteCategory = async (id) => {
  const response = await axiosInstance.delete(`/categories/${id}`);
  return response.data;
};
