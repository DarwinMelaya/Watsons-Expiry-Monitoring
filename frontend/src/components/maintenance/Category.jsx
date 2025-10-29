import { useState, useEffect } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";
import { Plus, Tag } from "lucide-react";
import CategoryModal from "../modal/CategoryModal";
import DeleteConfirmationModal from "../modal/DeleteConfirmationModal";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async (formData) => {
    try {
      setLoading(true);
      setError("");

      if (editingCategory) {
        // Update existing category
        await updateCategory(editingCategory._id, formData);
        setSuccess("Category updated successfully");
      } else {
        // Create new category
        await createCategory(formData);
        setSuccess("Category created successfully");
      }

      setShowCategoryModal(false);
      setEditingCategory(null);
      loadCategories();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = (category) => {
    setDeletingCategory(category);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await deleteCategory(deletingCategory._id);
      setSuccess("Category deleted successfully");
      setShowDeleteModal(false);
      setDeletingCategory(null);
      loadCategories();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModals = () => {
    setShowCategoryModal(false);
    setShowDeleteModal(false);
    setEditingCategory(null);
    setDeletingCategory(null);
    setError("");
    setSuccess("");
  };

  return (
    <div>
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Category Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Create and manage product categories
            </p>
          </div>
          <button
            onClick={handleAddCategory}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[#019e97] text-white rounded-lg hover:bg-[#019e97]/90 transition-colors disabled:opacity-50"
          >
            <Plus size={18} />
            Add Category
          </button>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Categories ({categories.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="w-8 h-8 border-4 border-[#019e97] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag size={24} className="text-gray-400" />
            </div>
            <p className="text-lg font-medium">No categories found</p>
            <p className="text-sm">Create your first category to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {categories.map((category) => (
              <div
                key={category._id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900 mb-1">
                      {category.name}
                    </h4>
                    {category.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {category.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Created:{" "}
                      {new Date(category.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      disabled={loading}
                      className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      disabled={loading}
                      className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CategoryModal
        isOpen={showCategoryModal}
        onClose={handleCloseModals}
        onSave={handleSaveCategory}
        category={editingCategory}
        loading={loading}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseModals}
        onConfirm={handleConfirmDelete}
        categoryName={deletingCategory?.name}
        loading={loading}
      />
    </div>
  );
};

export default Category;
