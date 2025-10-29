import { useState, useEffect } from "react";
import {
  getProducts,
  deleteProduct,
  getExpiringProducts,
} from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import AddExpiryModal from "../../components/modal/AddExpiryModal";
import { Plus, RefreshCw, Filter, X } from "lucide-react";

const Monitoring = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Store all products for filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [categories, setCategories] = useState([]);

  // Filter states
  const [filters, setFilters] = useState({
    month: "",
    year: "",
    category: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Apply filters whenever filters or allProducts change
    let filtered = [...allProducts];

    // Filter by month
    if (filters.month) {
      filtered = filtered.filter((product) => {
        const expiryDate = new Date(product.expiry);
        return expiryDate.getMonth() === parseInt(filters.month);
      });
    }

    // Filter by year
    if (filters.year) {
      filtered = filtered.filter((product) => {
        const expiryDate = new Date(product.expiry);
        return expiryDate.getFullYear() === parseInt(filters.year);
      });
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter((product) => {
        return product.category && product.category._id === filters.category;
      });
    }

    setProducts(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, allProducts]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setAllProducts(data);
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteProduct(id);
        setAllProducts(allProducts.filter((p) => p._id !== id));
        // Filters will be applied automatically via useEffect
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete product");
      }
    }
  };

  const handleItemAdded = (updatedItem) => {
    // Check if item already exists in allProducts (for append/replace operations)
    const existingIndex = allProducts.findIndex(
      (p) => p._id === updatedItem._id
    );
    if (existingIndex !== -1) {
      // Update existing item in allProducts
      const updatedAllProducts = [...allProducts];
      updatedAllProducts[existingIndex] = updatedItem;
      setAllProducts(updatedAllProducts);
    } else {
      // Add new item to allProducts
      setAllProducts([...allProducts, updatedItem]);
    }
    // Filters will be applied automatically via useEffect
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      month: "",
      year: "",
      category: "",
    });
  };

  const hasActiveFilters = filters.month || filters.year || filters.category;

  // Get unique years from products
  const getAvailableYears = () => {
    const years = new Set();
    allProducts.forEach((product) => {
      const year = new Date(product.expiry).getFullYear();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  // Get unique months based on selected year or all months
  const getAvailableMonths = () => {
    const months = new Set();
    allProducts.forEach((product) => {
      const expiryDate = new Date(product.expiry);
      if (
        !filters.year ||
        expiryDate.getFullYear() === parseInt(filters.year)
      ) {
        months.add(expiryDate.getMonth());
      }
    });
    return Array.from(months).sort((a, b) => a - b);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Filter Options
              </h2>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X size={16} />
                Clear Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Year
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019e97] focus:border-[#019e97] transition-colors bg-white"
              >
                <option value="">All Years</option>
                {getAvailableYears().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Month
              </label>
              <select
                value={filters.month}
                onChange={(e) => handleFilterChange("month", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019e97] focus:border-[#019e97] transition-colors bg-white"
              >
                <option value="">All Months</option>
                {getAvailableMonths().map((monthIndex) => (
                  <option key={monthIndex} value={monthIndex}>
                    {monthNames[monthIndex]}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019e97] focus:border-[#019e97] transition-colors bg-white"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Active Filters:
              </p>
              <div className="flex flex-wrap gap-2">
                {filters.year && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    Year: {filters.year}
                    <button
                      onClick={() => handleFilterChange("year", "")}
                      className="ml-1 hover:text-blue-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                {filters.month && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    Month: {monthNames[parseInt(filters.month)]}
                    <button
                      onClick={() => handleFilterChange("month", "")}
                      className="ml-1 hover:text-green-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                {filters.category && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                    Category:{" "}
                    {categories.find((c) => c._id === filters.category)?.name}
                    <button
                      onClick={() => handleFilterChange("category", "")}
                      className="ml-1 hover:text-purple-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Showing {products.length} of {allProducts.length} products
              </p>
            </div>
          )}
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
                    Category
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
                      colSpan="7"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <Filter size={24} className="text-gray-400" />
                        </div>
                        <p className="text-lg font-medium">No products found</p>
                        <p className="text-sm">
                          {hasActiveFilters
                            ? "Try adjusting your filters or clear them to see all products"
                            : "Add your first item to get started"}
                        </p>
                        {hasActiveFilters && (
                          <button
                            onClick={clearFilters}
                            className="mt-2 px-4 py-2 text-sm text-[#019e97] border border-[#019e97] rounded-lg hover:bg-[#019e97] hover:text-white transition-colors"
                          >
                            Clear All Filters
                          </button>
                        )}
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
                            {product.category ? (
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700">
                                {product.category.name}
                              </span>
                            ) : (
                              <span className="text-gray-400 italic">
                                No category
                              </span>
                            )}
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
