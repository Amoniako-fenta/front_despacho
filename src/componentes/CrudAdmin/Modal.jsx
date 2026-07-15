import PropTypes from "prop-types";

export const Modal = ({ open, onClose, children }) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-gray-900"
          aria-label="Cerrar modal"
        >
          ×
        </button>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

Modal.defaultProps = {
  children: null,
};