import { useState } from "react";
import Category from "../../components/maintenance/Category";
import { Settings, Tag } from "lucide-react";

const Maintenance = () => {
  const [activeTab, setActiveTab] = useState("category");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const tabs = [
    {
      id: "category",
      name: "Category",
      icon: Tag,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Maintenance
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage system categories and configurations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Settings size={20} className="text-gray-600" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-[#019e97] text-[#019e97]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "category" && <Category />}
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
