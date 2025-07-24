// DeleteAlertContent.jsx
const DeleteAlertContent = ({ 
    content, 
    onDelete, 
    onCancel, 
    title = "Confirm Deletion",
    cancelText = "Cancel",
    confirmText = "Delete",
    isLoading = false
}) => {
    return (
        <div className="p-6 w-full max-w-md">
            <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <svg 
                        className="w-8 h-8 text-red-600" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="1.5" 
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" 
                        />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {title}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                    {content}
                </p>
            </div>
            
            <div className="flex gap-3 justify-end">
                <button 
                    type="button"
                    className="px-5 py-2.5 text-base font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    {cancelText}
                </button>
                <button 
                    type="button"
                    className="px-5 py-2.5 text-base font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    onClick={onDelete}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Deleting...
                        </span>
                    ) : confirmText}
                </button>
            </div>
        </div>
    )
}

export default DeleteAlertContent;