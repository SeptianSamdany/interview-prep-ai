const SpinnerLoader = () => {
    return (
        <div role="status" className="flex justify-center items-center py-4">
            <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M100 50.5C100 78.3 77.6 100.7 49.8 100.7C22 100.7 0 78.3 0 50.5C0 22.7 22 0.299988 49.8 0.299988C77.6 0.299988 100 22.7 100 50.5Z"
                    fill="currentColor"
                />
                <path
                    d="M93.9 39.1C96.8 38.3 98.4 35 97.1 32.3C95.2 28.1 92.6 24.2 89.3 20.8C85.6 17 81.1 14 76 11.7C70.8 9.40001 65.2 8.00001 59.5 7.50001C56.5 7.20001 53.5 7.30001 50.6 7.80001C47.5 8.40001 45.8 11.9 47.6 14.6C49.2 17.1 51.9 18.9 54.9 19.1C58.6 19.3 62.2 20 65.5 21.3C69 22.6 72.3 24.6 75.1 27.3C77.3 29.5 79.2 32.1 80.7 35C82.1 37.7 85.5 39.8 88.7 39.1C90.5 38.7 92.2 38.6 93.9 39.1Z"
                    fill="currentFill"
                />
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default SpinnerLoader;
