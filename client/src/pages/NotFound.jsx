import { Link } from 'react-router-dom'; // or 'next/link' if using Next.js

const NotFound = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-gray-200 px-4">
            {/* Terminal Command Header */}
            <div className="text-left max-w-xl w-full mb-6">
                <p className="text-blue-400 font-mono text-sm mb-2">
                    $ cd /requested-page
                </p>

                {/* Large 404 Display */}
                <h1 className="text-7xl sm:text-8xl font-bold tracking-tight text-white mb-3">
                    404
                </h1>

                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-300 mb-4">
                    Page Not Found
                </h2>

                {/* Subtitle / Description */}
                <p className="text-gray-400 text-base sm:text-lg mb-8 leading-relaxed">
                    Looks like you hit a broken link or entered a URL that doesn't exist. Let’s get you back on track.
                </p>

                {/* Action Buttons matching your theme */}
                <div className="flex flex-wrap gap-4">
                    <Link
                        to="/"
                        className="px-5 py-2.5 bg-[#7096f8] text-gray-900 font-medium rounded-lg hover:bg-blue-400 transition-colors duration-200"
                    >
                        Back to Home
                    </Link>
                    <Link
                        to="/projects"
                        className="px-5 py-2.5 border border-gray-700 bg-[#161b22] text-gray-300 font-medium rounded-lg hover:border-gray-500 hover:text-white transition-colors duration-200"
                    >
                        View Projects
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;