import { FaSpinner } from "react-icons/fa";

const Loader = () => {
  return (
    <div
      className="flex flex-col items-center justify-center p-4 space-y-4"
      data-testid="loader-container"
    >
      <FaSpinner
        className="w-8 h-8 text-gray-500 animate-spin"
        data-testid="loader-spinner"
      />
      <p className="text-lg text-gray-500" data-testid="loader-text">
        Loading...
      </p>
    </div>
  );
};

export default Loader;
