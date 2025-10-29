import { AlertTriangle, X } from "lucide-react";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  categoryName,
  loading = false,
}) => {
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Delete Category
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
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-base font-medium text-gray-900 mb-2">
                Are you sure you want to delete this category?
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                This will permanently delete the category{" "}
                <strong>"{categoryName}"</strong> and cannot be undone.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
