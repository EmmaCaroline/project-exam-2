/**
 * ConfirmModal component renders a modal dialog to confirm or cancel an action.
 *
 * The modal is only rendered when `isOpen` is true.
 *
 * Props:
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible.
 * @param {() => void} props.onConfirm - Callback function called when the Confirm button is clicked.
 * @param {() => void} props.onCancel - Callback function called when the Cancel button is clicked.
 * @param {string} props.message - Message to display inside the modal.
 *
 * Returns:
 * @returns {JSX.Element|null} JSX markup for the confirmation modal or null if not open.
 */
const ConfirmModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="modal-content bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
