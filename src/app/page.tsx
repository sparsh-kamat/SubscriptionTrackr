
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Welcome to Underground Tix</h1>
      <p className="mt-4 text-lg">Your underground show hub</p>
      <div className="mt-8">
        <a href="/auth/signin" className="px-4 py-2 text-white bg-blue-500 rounded">
          Sign In
        </a>
        <a href="/auth/register" className="ml-4 px-4 py-2 text-white bg-green-500 rounded">
          Register
        </a>
      </div>
    </div>
  );
}
