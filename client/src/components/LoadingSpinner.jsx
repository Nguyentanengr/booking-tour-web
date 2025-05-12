const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      <span className="text-xl text-blue-500">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
