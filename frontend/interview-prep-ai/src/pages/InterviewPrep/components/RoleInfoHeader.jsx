const RoleInfoHeader = ({
    role, 
    topicsToFocus, 
    experience, 
    questions, 
    description, 
    lastUpdated, 
}) => {
    return (
        <div className="bg-white relative">
            <div className="container mx-auto px-4 md:px-8"> {/* PERBAIKAN: px-10 -> px-4 untuk mobile */}
                <div className="h-[200px] flex flex-col justify-center relative z-10">
                    <div className="flex items-start">
                        <div className="flex-grow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-medium">
                                        {role || "No Role Specified"} {/* PERBAIKAN: Fallback jika role kosong */}
                                    </h2>
                                    <p className="text-sm font-medium text-gray-900 mt-1"> {/* PERBAIKAN: text-medium -> font-medium */}
                                        {topicsToFocus || "No topics specified"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-4"> {/* PERBAIKAN: Tambah flex-wrap untuk responsiveness */}
                        <div className="text-[10px] font-semibold text-white bg-black px-3 py-1 rounded-full">
                            Experience: {experience === 1 ? "1 Year" : `${experience} Years`} {/* PERBAIKAN: === instead of == dan format yang lebih jelas */}
                        </div>

                        <div className="text-[10px] font-semibold text-white bg-black px-3 py-1 rounded-full">
                            {questions} Q & A
                        </div>

                        {lastUpdated && ( /* PERBAIKAN: Conditional rendering jika lastUpdated ada */
                            <div className="text-[10px] font-semibold text-white bg-black px-3 py-1 rounded-full">
                                Last Updated: {lastUpdated}
                            </div>
                        )}
                    </div>

                    {/* PERBAIKAN: Tampilkan description jika ada */}
                    {description && (
                        <p className="text-sm text-gray-600 mt-3 max-w-2xl">
                            {description}
                        </p>
                    )}
                </div>

                {/* Background Animation - PERBAIKAN: Perbaikan positioning dan size */}
                <div className="w-[200px] h-[200px] flex items-center justify-center bg-white overflow-hidden absolute top-0 right-4 md:right-8">
                    <div className="w-12 h-12 bg-lime-400 blur-[40px] animate-blob1 absolute"></div> {/* PERBAIKAN: Tambah height dan absolute positioning */}
                    <div className="w-12 h-12 bg-teal-400 blur-[40px] animate-blob2 absolute"></div>
                    <div className="w-12 h-12 bg-cyan-400 blur-[40px] animate-blob3 absolute"></div>
                    <div className="w-12 h-12 bg-fuchsia-400 blur-[40px] animate-blob4 absolute"></div>
                </div>
            </div>
        </div>
    )
}

export default RoleInfoHeader;