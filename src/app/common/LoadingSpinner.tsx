export default function LoadingSpinner() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-200 dark:to-gray-300">
      {/* Main loading container */}
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="w-16 h-16 rounded-full border-4 border-gray-100 border-t-blue-500 animate-spin"></div>

        {/* Inner pulsing circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-900/30 rounded-full animate-pulse"></div>
      </div>

      {/* Loading text */}
      <div className="mt-8 space-y-2 text-center">
        <h2 className="font-consolas text-xl font-semibold text-gray-800 dark:text-gray-800">
          Loading
        </h2>
        <p className="font-raleway text-sm text-gray-700 dark:text-gray-700 font-semibold">
          Please wait while we prepare your experience
        </p>
      </div>

      {/* Bottom dots */}
      <div className="mt-6 flex space-x-2">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{
              animationDelay: `${index * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
