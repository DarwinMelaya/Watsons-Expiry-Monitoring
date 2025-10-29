import { useState } from "react";
import {
  createProduct,
  checkDuplicateProduct,
  appendProductQuantity,
  updateProduct,
} from "../../services/productService";
import { X } from "lucide-react";

const AddExpiryModal = ({ isOpen, onClose, onItemAdded }) => {
  const [newItem, setNewItem] = useState({
    sku: "",
    description: "",
    expiry: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [duplicateItem, setDuplicateItem] = useState(null);
  const [showAppendReplace, setShowAppendReplace] = useState(false);

  const handleInputChange = (e) => {
    setNewItem({
      ...newItem,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Check if product with same SKU and month exists
      const duplicateCheck = await checkDuplicateProduct(
        newItem.sku,
        newItem.expiry
      );

      if (duplicateCheck.exists) {
        setDuplicateItem(duplicateCheck.item);
        setShowAppendReplace(true);
        setLoading(false);
        return;
      }

      // No duplicate, create new product
      const itemData = {
        sku: newItem.sku,
        description: newItem.description,
        expiry: newItem.expiry,
        quantity: parseInt(newItem.quantity),
      };
      const createdItem = await createProduct(itemData);
      onItemAdded(createdItem);
      setNewItem({ sku: "", description: "", expiry: "", quantity: "" });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const handleAppend = async () => {
    try {
      setLoading(true);
      setError(null);
      const updatedItem = await appendProductQuantity(
        duplicateItem._id,
        parseInt(newItem.quantity)
      );
      onItemAdded(updatedItem);
      setNewItem({ sku: "", description: "", expiry: "", quantity: "" });
      setDuplicateItem(null);
      setShowAppendReplace(false);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to append quantity");
    } finally {
      setLoading(false);
    }
  };

  const handleReplace = async () => {
    try {
      setLoading(true);
      setError(null);
      const updatedItem = await updateProduct(duplicateItem._id, {
        quantity: parseInt(newItem.quantity),
        description: newItem.description, // Update description too
      });
      onItemAdded(updatedItem);
      setNewItem({ sku: "", description: "", expiry: "", quantity: "" });
      setDuplicateItem(null);
      setShowAppendReplace(false);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to replace quantity");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppendReplace = () => {
    setShowAppendReplace(false);
    setDuplicateItem(null);
  };

  const handleClose = () => {
    setNewItem({ sku: "", description: "", expiry: "", quantity: "" });
    setError(null);
    setDuplicateItem(null);
    setShowAppendReplace(false);
    onClose();
  };

  if (!isOpen) return null;

  // Append/Replace Confirmation Modal
  if (showAppendReplace && duplicateItem) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={handleCancelAppendReplace}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Product Already Exists
            </h2>
            <button
              onClick={handleCancelAppendReplace}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 mb-2">
                A product with SKU{" "}
                <span className="font-semibold">"{duplicateItem.sku}"</span>{" "}
                already exists for the same expiry month.
              </p>
              <div className="text-sm text-gray-700">
                <p>
                  <span className="font-medium">Current Quantity:</span>{" "}
                  {duplicateItem.quantity}
                </p>
                <p>
                  <span className="font-medium">New Quantity:</span>{" "}
                  {newItem.quantity}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleAppend}
                disabled={loading}
                className="w-full px-4 py-3 bg-[#019e97] text-white rounded-lg hover:bg-[#019e97]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading
                  ? "Processing..."
                  : `Append (${duplicateItem.quantity} + ${
                      newItem.quantity
                    } = ${
                      parseInt(duplicateItem.quantity) +
                      parseInt(newItem.quantity)
                    })`}
              </button>
              <button
                onClick={handleReplace}
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading
                  ? "Processing..."
                  : `Replace (Update to ${newItem.quantity})`}
              </button>
              <button
                onClick={handleCancelAppendReplace}
                disabled={loading}
                className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Add New Item</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU *
              </label>
              <input
                type="text"
                name="sku"
                value={newItem.sku}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019e97] focus:border-[#019e97] transition-colors"
                placeholder="Enter SKU"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <input
                type="text"
                name="description"
                value={newItem.description}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019e97] focus:border-[#019e97] transition-colors"
                placeholder="Enter description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date *
              </label>
              <input
                type="date"
                name="expiry"
                value={newItem.expiry}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019e97] focus:border-[#019e97] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={newItem.quantity}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019e97] focus:border-[#019e97] transition-colors"
                placeholder="Enter quantity"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#019e97] text-white rounded-lg hover:bg-[#019e97]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpiryModal;
