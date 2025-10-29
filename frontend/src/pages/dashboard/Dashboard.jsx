import { useState, useEffect } from "react";
import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import { getExpiringProducts } from "../../services/productService";
import { format } from "date-fns";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    expiring7Days: 0,
    expiring30Days: 0,
    expired: 0,
    totalCategories: 0,
  });
  const [expiringProducts, setExpiringProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [products, categories, expiring7, expiring30] = await Promise.all([
        getProducts(),
        getCategories(),
        getExpiringProducts(7),
        getExpiringProducts(30),
      ]);

      const now = new Date();
      const expiredCount = products.filter(
        (product) => new Date(product.expiry) < now
      ).length;

      setStats({
        totalProducts: products.length,
        expiring7Days: expiring7.length,
        expiring30Days: expiring30.length,
        expired: expiredCount,
        totalCategories: categories.length,
      });

      // Get top 10 products expiring soon (within 30 days)
      const sortedExpiring = expiring30
        .filter((product) => new Date(product.expiry) >= now)
        .sort((a, b) => new Date(a.expiry) - new Date(b.expiry))
        .slice(0, 10);

      setExpiringProducts(sortedExpiring);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (expiryDate) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days < 0) return { label: "Expired", color: "bg-red-100 text-red-800" };
    if (days <= 7) return { label: "Critical", color: "bg-red-100 text-red-800" };
    if (days <= 30) return { label: "Warning", color: "bg-yellow-100 text-yellow-800" };
    return { label: "OK", color: "bg-green-100 text-green-800" };
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Products</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {stats.totalProducts}
              </p>
            </div>
            <div className="text-blue-500 text-3xl">📦</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">
                Expiring in 7 Days
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {stats.expiring7Days}
              </p>
            </div>
            <div className="text-orange-500 text-3xl">⚠️</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">
                Expiring in 30 Days
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {stats.expiring30Days}
              </p>
            </div>
            <div className="text-yellow-500 text-3xl">⏰</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Expired</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {stats.expired}
              </p>
            </div>
            <div className="text-red-500 text-3xl">❌</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Categories</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {stats.totalCategories}
              </p>
            </div>
            <div className="text-green-500 text-3xl">🏷️</div>
          </div>
        </div>
      </div>

      {/* Expiring Products Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Products Expiring Soon
          </h2>
          {expiringProducts.length === 0 && (
            <p className="text-sm text-gray-500">No products expiring soon</p>
          )}
        </div>

        {expiringProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Days Left
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expiringProducts.map((product) => {
                  const days = getDaysUntilExpiry(product.expiry);
                  const status = getExpiryStatus(product.expiry);
                  return (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {product.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category?.name || "No Category"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(product.expiry), "MMM dd, yyyy")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {days < 0 ? (
                          <span className="text-red-600 font-medium">
                            {Math.abs(days)} days ago
                          </span>
                        ) : (
                          <span className={days <= 7 ? "text-red-600 font-medium" : days <= 30 ? "text-yellow-600 font-medium" : ""}>
                            {days} days
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No products expiring in the next 30 days.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
