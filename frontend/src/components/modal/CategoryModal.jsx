import { useState, useEffect } from "react";
import { X } from "lucide-react";

const CategoryModal = ({
  isOpen,
  onClose,
  onSave,
  category = null,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Reset form when modal opens/closes or category changes
  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormData({
          name: category.name,
          description: category.description || "",
        });
      } else {
        setFormData({
          name: "",
          description: "",
        });
      }
    }
  }, [isOpen, category]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSave(formData);
  };

  const handleClose = () => {
    setFormData({ name: "", description: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {category ? "Edit Category" : "Add New Category"}
          </h3>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019e97] focus:border-[#019e97] disabled:opacity-50"
                placeholder="Enter category name"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019e97] focus:border-[#019e97] disabled:opacity-50"
                placeholder="Enter category description (optional)"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#019e97] text-white rounded-lg hover:bg-[#019e97]/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : category ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
