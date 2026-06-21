import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-black px-4">
      <p className="font-bold text-sm uppercase tracking-[0.24em] text-green-500">
        Error 404
      </p>
      <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
      <p className="mt-3 max-w-md text-center text-sm leading-7 text-slate-400">
        The page you're looking for doesn't exist or is still under
        construction.
      </p>
      <Link
        href="/"
        className="text-white mt-8 rounded-md bg-green-600 px-6 py-2 text-sm font-medium transition hover:bg-green-700"
      >
        Back to Home
      </Link>
    </main>
  );
}
