"use client";
import { useSession, signOut } from "next-auth/react"; // Combined imports
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  // Define common button styles
  const buttonBaseStyle =
    "w-full sm:w-auto inline-flex justify-center px-6 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out";
  const primaryButtonStyle = `${buttonBaseStyle} bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500`;
  const secondaryButtonStyle = `${buttonBaseStyle} bg-green-600 hover:bg-green-700 focus:ring-green-500`;
  const dangerButtonStyle = `${buttonBaseStyle} bg-red-600 hover:bg-red-700 focus:ring-red-500`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12  bg-gray-50">
      {" "}
      {/* Added gradient background */}
      <div className="w-full max-w-md p-8 space-y-6  rounded-xl shadow-xl text-center">
        {" "}
        {/* Container with more padding, rounded corners, shadow */}
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to Underground Tix
        </h1>
        <p className="text-lg text-gray-600">Your underground show hub</p>

        {session && session.user ? (
          <div className="mt-8 pt-6 border-t border-gray-200">
            {" "}
            {/* Added top border for separation */}
            <h2 className="text-2xl font-semibold text-gray-700">
              Hello, <span className="text-indigo-600">{session.user.name}</span>! {/* Highlight name */}
            </h2>
            <p className="mt-2 text-lg text-gray-600">You are logged in.</p>
            <button
              onClick={() => signOut()}
              className={`mt-6 ${dangerButtonStyle}`} // Use danger style
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="mt-8 pt-6 border-t border-gray-200">
            {" "}
            {/* Added top border for separation */}
            <h2 className="text-2xl font-semibold text-gray-700">
              Welcome, Guest!
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Please sign in or register.
            </p>
            <div className="mt-6 space-y-4 sm:space-y-0 sm:flex sm:space-x-4 justify-center">
              {" "}
              {/* Button container */}
              <button
                onClick={() => router.push("/auth/signin")}
                className={primaryButtonStyle} // Use primary style
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/auth/register")}
                className={secondaryButtonStyle} // Use secondary style
              >
                Register
              </button>
            </div>
          </div>
        )}
      </div>
      <footer className="mt-8 text-sm text-gray-500">
        © {new Date().getFullYear()} Underground Tix. All rights reserved.
      </footer>
    </div>
  );
}
