import { useState, useEffect } from "react";
import {
  getProducts,
  deleteProduct,
  getExpiringProducts,
} from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import AddExpiryModal from "../../components/modal/AddExpiryModal";
import DeleteExpiryModal from "../../components/modal/DeleteExpiryModal";
import EditExpiryModal from "../../components/modal/EditExpiryModal";
import {
  Plus,
  RefreshCw,
  Filter,
  X,
  Package,
  Calendar,
  AlertCircle,
  Edit,
  Trash2,
  TrendingUp,
  Activity,
  Printer,
} from "lucide-react";

const Monitoring = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Store all products for filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const [deleting, setDeleting] = useState(false);
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

  const handleDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setDeleting(true);
      setError(null);
      await deleteProduct(productToDelete._id);
      setAllProducts(allProducts.filter((p) => p._id !== productToDelete._id));
      setShowDeleteModal(false);
      setProductToDelete(null);
      // Filters will be applied automatically via useEffect
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    if (!deleting) {
      setShowDeleteModal(false);
      setProductToDelete(null);
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

  const handleEdit = (product) => {
    setProductToEdit(product);
    setShowEditModal(true);
  };

  const handleItemUpdated = (updatedItem) => {
    // Update the item in allProducts
    const existingIndex = allProducts.findIndex(
      (p) => p._id === updatedItem._id
    );
    if (existingIndex !== -1) {
      const updatedAllProducts = [...allProducts];
      updatedAllProducts[existingIndex] = updatedItem;
      setAllProducts(updatedAllProducts);
    }
    setShowEditModal(false);
    setProductToEdit(null);
    // Filters will be applied automatically via useEffect
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setProductToEdit(null);
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

  const handlePrint = () => {
    window.print();
  };

  const getFilterSummary = () => {
    const summary = [];
    if (filters.year) summary.push(`Year: ${filters.year}`);
    if (filters.month)
      summary.push(`Month: ${monthNames[parseInt(filters.month)]}`);
    if (filters.category) {
      const categoryName = categories.find(
        (c) => c._id === filters.category
      )?.name;
      if (categoryName) summary.push(`Category: ${categoryName}`);
    }
    return summary.length > 0 ? summary.join(", ") : "All Products";
  };

  // Calculate statistics
  const stats = {
    total: allProducts.length,
    expiringSoon: allProducts.filter((p) => {
      const days = getDaysUntilExpiry(p.expiry);
      return days > 0 && days <= 30;
    }).length,
    expired: allProducts.filter((p) => getDaysUntilExpiry(p.expiry) < 0).length,
    critical: allProducts.filter((p) => {
      const days = getDaysUntilExpiry(p.expiry);
      return days > 0 && days <= 7;
    }).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#019e97] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Print Styles */}
      <style>{`
        /* Hide print elements on screen */
        .print-container {
          display: none;
        }

        @media print {
          @page {
            size: A4;
            margin: 0.8cm;
          }

          body * {
            visibility: hidden;
          }

          .print-container,
          .print-container * {
            visibility: visible;
          }

          .print-container {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
            padding: 0;
            margin: 0;
          }

          .no-print {
            display: none !important;
          }

          .print-header {
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 1px solid #333;
            display: block !important;
          }

          .print-header h1 {
            font-size: 18px;
            margin: 0 0 4px 0;
            color: #019e97;
            line-height: 1.2;
          }

          .print-header p {
            font-size: 9px;
            color: #666;
            margin: 2px 0;
            line-height: 1.3;
          }

          .print-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
            margin-bottom: 8px;
            font-size: 8px;
            display: table !important;
          }

          .print-table thead {
            background: #f3f4f6;
          }

          .print-table th {
            padding: 4px 4px;
            text-align: left;
            font-weight: bold;
            border: 1px solid #d1d5db;
            font-size: 7px;
            text-transform: uppercase;
            line-height: 1.2;
          }

          .print-table td {
            padding: 3px 4px;
            border: 1px solid #e5e7eb;
            line-height: 1.3;
          }

          .print-table tbody tr {
            page-break-inside: avoid;
          }

          .print-table thead {
            display: table-header-group;
          }

          .print-table tbody {
            display: table-row-group;
          }

          .print-status {
            padding: 2px 5px;
            border-radius: 2px;
            font-size: 7px;
            font-weight: 600;
            display: inline-block;
            line-height: 1.2;
          }

          .print-footer {
            margin-top: 8px;
            padding-top: 6px;
            border-top: 1px solid #e5e7eb;
            font-size: 8px;
            color: #666;
            text-align: center;
            display: block !important;
          }

          .print-filter-info {
            font-size: 8px;
            color: #555;
            margin: 4px 0;
            padding: 4px;
            background: #f9fafb;
            border-left: 2px solid #019e97;
            line-height: 1.3;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10 no-print">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <Activity className="text-[#019e97]" size={28} />
                  Product Expiry Monitoring
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage and monitor product expiry dates
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="no-print flex items-center justify-center gap-2 px-4 py-2.5 bg-[#019e97] text-white rounded-lg hover:bg-[#019e97]/90 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">Add Item</span>
                  <span className="sm:hidden">Add</span>
                </button>
                <button
                  onClick={fetchProducts}
                  className="no-print flex items-center justify-center gap-2 px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  <RefreshCw size={18} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="no-print flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  <Printer size={18} />
                  <span className="hidden sm:inline">Print Report</span>
                  <span className="sm:hidden">Print</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="print-container">
          {/* Print Header */}
          <div className="print-header">
            <h1>Product Expiry Monitoring Report</h1>
            <p>
              Generated on:{" "}
              {new Date().toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="print-filter-info">Filter: {getFilterSummary()}</p>
          </div>

          {/* Print Table */}
          <table className="print-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Description</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Expiry Date</th>
                <th>Days Left</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const daysUntil = getDaysUntilExpiry(product.expiry);
                const status = getExpiryStatus(daysUntil);
                return (
                  <tr key={product._id}>
                    <td>{product.sku}</td>
                    <td>{product.description}</td>
                    <td>{product.category?.name || "N/A"}</td>
                    <td style={{ textAlign: "center" }}>{product.quantity}</td>
                    <td>{formatDate(product.expiry)}</td>
                    <td style={{ textAlign: "center" }}>
                      {daysUntil >= 0 ? `${daysUntil}d` : "Expired"}
                    </td>
                    <td>
                      <span
                        className="print-status"
                        style={{
                          backgroundColor:
                            daysUntil < 0
                              ? "#fee2e2"
                              : daysUntil <= 7
                              ? "#fee2e2"
                              : daysUntil <= 30
                              ? "#fef3c7"
                              : "#dcfce7",
                          color:
                            daysUntil < 0
                              ? "#991b1b"
                              : daysUntil <= 7
                              ? "#991b1b"
                              : daysUntil <= 30
                              ? "#92400e"
                              : "#166534",
                        }}
                      >
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Print Footer */}
          <div className="print-footer">
            <p>
              Report contains {products.length} product
              {products.length !== 1 ? "s" : ""} | Page{" "}
              <span className="page-number"></span>
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {error && (
            <div className="no-print mb-4 sm:mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} className="text-red-600" />
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Statistics Cards */}
          <div className="no-print grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">
                    Total Products
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
                    {stats.total}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="text-blue-600" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">
                    Critical
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-red-600 mt-1">
                    {stats.critical}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="text-red-600" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">
                    Expiring Soon
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mt-1">
                    {stats.expiringSoon}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-yellow-600" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">
                    Expired
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-red-700 mt-1">
                    {stats.expired}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Calendar className="text-red-700" size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="no-print bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#019e97]/10 rounded-lg flex items-center justify-center">
                  <Filter size={18} className="text-[#019e97]" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  Filter Options
                </h2>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all w-full sm:w-auto justify-center"
                >
                  <X size={16} />
                  Clear Filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* Year Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter by Year
                </label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange("year", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019e97] focus:border-[#019e97] transition-all bg-white text-sm"
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter by Month
                </label>
                <select
                  value={filters.month}
                  onChange={(e) => handleFilterChange("month", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019e97] focus:border-[#019e97] transition-all bg-white text-sm"
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
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter by Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019e97] focus:border-[#019e97] transition-all bg-white text-sm"
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
              <div className="mt-4 sm:mt-5 pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Active Filters:
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {filters.year && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-medium shadow-sm">
                      Year: {filters.year}
                      <button
                        onClick={() => handleFilterChange("year", "")}
                        className="ml-0.5 hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                        aria-label="Remove year filter"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {filters.month && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs sm:text-sm font-medium shadow-sm">
                      Month: {monthNames[parseInt(filters.month)]}
                      <button
                        onClick={() => handleFilterChange("month", "")}
                        className="ml-0.5 hover:bg-green-100 rounded-full p-0.5 transition-colors"
                        aria-label="Remove month filter"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {filters.category && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs sm:text-sm font-medium shadow-sm">
                      Category:{" "}
                      {categories.find((c) => c._id === filters.category)?.name}
                      <button
                        onClick={() => handleFilterChange("category", "")}
                        className="ml-0.5 hover:bg-purple-100 rounded-full p-0.5 transition-colors"
                        aria-label="Remove category filter"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  Showing{" "}
                  <span className="font-bold text-gray-700">
                    {products.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-gray-700">
                    {allProducts.length}
                  </span>{" "}
                  products
                </p>
              </div>
            )}
          </div>

          {/* Products Display - Cards on Mobile, Table on Desktop */}
          {products.length === 0 ? (
            <div className="no-print bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <Filter size={32} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                    No products found
                  </p>
                  <p className="text-sm sm:text-base text-gray-600 max-w-md">
                    {hasActiveFilters
                      ? "Try adjusting your filters or clear them to see all products"
                      : "Add your first item to get started"}
                  </p>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-2 px-6 py-2.5 text-sm font-medium text-[#019e97] border-2 border-[#019e97] rounded-lg hover:bg-[#019e97] hover:text-white transition-all"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="no-print block md:hidden space-y-3">
                {products.map((product) => {
                  const daysUntil = getDaysUntilExpiry(product.expiry);
                  const status = getExpiryStatus(daysUntil);
                  return (
                    <div
                      key={product._id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Package size={16} className="text-[#019e97]" />
                            <p className="text-sm font-bold text-gray-900">
                              {product.sku}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {product.description}
                          </p>
                        </div>
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${status.color} whitespace-nowrap`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Quantity:</span>
                          <span className="font-semibold text-gray-900">
                            {product.quantity}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Expiry:</span>
                          <span className="font-semibold text-gray-900">
                            {formatDate(product.expiry)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Days Left:</span>
                          <span className="font-bold text-gray-900">
                            {daysUntil >= 0 ? `${daysUntil}d` : "Expired"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Category:</span>
                          {product.category ? (
                            <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-md bg-blue-50 text-blue-700">
                              {product.category.name}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic text-xs">
                              No category
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => handleEdit(product)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-[#019e97] border border-[#019e97] rounded-lg hover:bg-[#019e97] hover:text-white transition-all"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-all"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <div className="no-print hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          SKU
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Expiry Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => {
                        const daysUntil = getDaysUntilExpiry(product.expiry);
                        const status = getExpiryStatus(daysUntil);
                        return (
                          <tr
                            key={product._id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-semibold text-gray-900">
                                {product.sku}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-600 max-w-xs truncate">
                                {product.description}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {product.category ? (
                                <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700">
                                  {product.category.name}
                                </span>
                              ) : (
                                <span className="text-gray-400 italic text-sm">
                                  No category
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {product.quantity}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">
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
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleEdit(product)}
                                  className="flex items-center gap-1.5 text-[#019e97] hover:text-[#019e97]/80 transition-colors font-medium"
                                >
                                  <Edit size={16} />
                                  Edit
                                </button>
                                <span className="text-gray-300">|</span>
                                <button
                                  onClick={() => handleDelete(product)}
                                  className="flex items-center gap-1.5 text-red-600 hover:text-red-900 transition-colors"
                                >
                                  <Trash2 size={16} />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Add Item Modal */}
        <AddExpiryModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onItemAdded={handleItemAdded}
        />

        {/* Edit Product Modal */}
        <EditExpiryModal
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          onItemUpdated={handleItemUpdated}
          product={productToEdit}
        />

        {/* Delete Product Modal */}
        <DeleteExpiryModal
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          product={productToDelete}
          loading={deleting}
        />
      </div>
    </>
  );
};

export default Monitoring;
