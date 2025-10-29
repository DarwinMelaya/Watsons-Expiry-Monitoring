import { useState, useEffect } from "react";
import {
  getProducts,
  deleteProduct,
  getExpiringProducts,
} from "../../services/productService";
import AddExpiryModal from "../../components/modal/AddExpiryModal";
import { Plus, RefreshCw, Filter } from "lucide-react";

const Monitoring = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDays, setFilterDays] = useState(30);
  const [showExpiring, setShowExpiring] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete product");
      }
    }
  };

  const handleItemAdded = (updatedItem) => {
    // Check if item already exists (for append/replace operations)
    const existingIndex = products.findIndex((p) => p._id === updatedItem._id);
    if (existingIndex !== -1) {
      // Update existing item
      const updatedProducts = [...products];
      updatedProducts[existingIndex] = updatedItem;
      setProducts(updatedProducts);
    } else {
      // Add new item
      setProducts([...products, updatedItem]);
    }
  };

  const handleShowExpiring = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getExpiringProducts(filterDays);
      setProducts(data);
      setShowExpiring(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch expiring products"
      );
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (days) => {
    if (days < 0) return { label: "Expired", color: "text-red-600 bg-red-50" };
    if (days <= 7)
      return { label: "Critical", color: "text-red-600 bg-red-50" };
    if (days <= 30)
      return { label: "Warning", color: "text-yellow-600 bg-yellow-50" };
    return { label: "Good", color: "text-green-600 bg-green-50" };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Product Expiry Monitoring
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage and monitor product expiry dates
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#019e97] text-white rounded-lg hover:bg-[#019e97]/90 transition-colors"
            >
              <Plus size={18} />
              Add Item
            </button>
            <button
              onClick={fetchProducts}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Filter Options
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <span className="text-gray-700">Show expiring within:</span>
              <input
                type="number"
                value={filterDays}
                onChange={(e) => setFilterDays(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg w-24 focus:ring-2 focus:ring-[#019e97] focus:border-[#019e97]"
                min="1"
                disabled={showExpiring}
              />
              <span className="text-gray-700">days</span>
            </label>
            <button
              onClick={handleShowExpiring}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
              disabled={showExpiring}
            >
              Filter Expiring
            </button>
            {showExpiring && (
              <button
                onClick={() => {
                  setShowExpiring(false);
                  fetchProducts();
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Show All
              </button>
            )}
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <Filter size={24} className="text-gray-400" />
                        </div>
                        <p className="text-lg font-medium">No products found</p>
                        <p className="text-sm">
                          Add your first item to get started
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const daysUntil = getDaysUntilExpiry(product.expiry);
                    const status = getExpiryStatus(daysUntil);
                    return (
                      <tr
                        key={product._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {product.sku}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {product.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {product.quantity}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatDate(product.expiry)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${status.color}`}
                          >
                            {status.label} (
                            {daysUntil >= 0 ? `${daysUntil}d` : "Expired"})
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      <AddExpiryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onItemAdded={handleItemAdded}
      />
    </div>
  );
};

export default Monitoring;
