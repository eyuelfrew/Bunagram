const LoadingConversation = () => {
  return (
    <div className="flex px-2 py-1 justify-between items-center animate-pulse">
      <div className="flex">
        <div className="flex px-2 py-1 relative">
          <div className="w-16 h-16 rounded-full bg-gray-600"></div>
          <div className="absolute w-3 h-3 rounded-full bg-gray-300 right-1 top-11"></div>
        </div>
        <div className="mt-2">
          <p className="h-4 bg-gray-600 rounded w-32 mb-2"></p>
          <p className="h-3 bg-gray-600 rounded w-36"></p>
        </div>
      </div>
      <div>
        <div className="rounded-full w-7 h-7 bg-gray-600"></div>
      </div>
    </div>
  );
};

export default LoadingConversation;
