const LoadingComliantsSkeleton = () => {
  return (
    <div className="flex w-full gap-5 justify-center md:justify-center mb-4 flex-wrap">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-2xl p-10 w-full animate-pulse"
        >
          <ul className="space-y-4 flex  flex-col">
            <li className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-gray-50">
              <div className="flex flex-col space-y-2">
                <div className="h-4 bg-gray-300 rounded w-40"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 w-20 bg-gray-300 rounded"></div>
                <div className="h-8 w-20 bg-gray-300 rounded"></div>
              </div>
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default LoadingComliantsSkeleton;
