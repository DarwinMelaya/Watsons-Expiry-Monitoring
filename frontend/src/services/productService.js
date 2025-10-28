import axiosInstance from "../lib/axios";

// Get all products
export const getProducts = async () => {
  const response = await axiosInstance.get("/products");
  return response.data;
};

// Get single product
export const getProduct = async (id) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

// Create product
export const createProduct = async (productData) => {
  const response = await axiosInstance.post("/products", productData);
  return response.data;
};

// Update product
export const updateProduct = async (id, productData) => {
  const response = await axiosInstance.put(`/products/${id}`, productData);
  return response.data;
};

// Delete product
export const deleteProduct = async (id) => {
  const response = await axiosInstance.delete(`/products/${id}`);
  return response.data;
};

// Get products expiring soon
export const getExpiringProducts = async (days = 30) => {
  const response = await axiosInstance.get(`/products/expiring/${days}`);
  return response.data;
};
