import PropTypes from "prop-types";

export const CardComponent = ({
  title,
  description,
  buttonText,
  onClick,
}) => {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow">
      <h3 className="mb-2 text-2xl font-bold text-gray-800">{title}</h3>

      <p className="mb-4 text-gray-600">{description}</p>

      <button
        type="button"
        onClick={onClick}
        className="px-5 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700"
      >
        {buttonText}
      </button>
    </div>
  );
};

CardComponent.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};