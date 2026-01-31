import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <div className="w-full max-w-md rounded-xl p-8 text-center shadow-sm">
        {/* Big 404 */}
        <h1 className="text-6xl font-bold text-primary">404</h1>

        {/* Title */}
        <h2 className="mt-4 text-xl font-semibold text-textSec">
          Page not found
        </h2>

        {/* Description */}
        <p className="mt-2 text-sm text-textPri">
          The page you’re trying to access doesn’t exist or may have been moved.
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            <ArrowLeft size={16} />
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
