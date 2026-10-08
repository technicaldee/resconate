import Link from "next/link";
import { PublicLayout } from "../components/ui";
export default function NotFound() {
  return (
    <PublicLayout title="Page not found">
      <div className="error-page">
        <p className="eyebrow">404</p>
        <h1>This page is not here.</h1>
        <Link href="/" className="button">
          Return home
        </Link>
      </div>
    </PublicLayout>
  );
}
