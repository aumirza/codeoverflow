import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <nav>
        <Link target="_blank" href="/register">
          Register
        </Link>
        <Link target="_blank" href="/login">
          Login
        </Link>
      </nav>
    </main>
  );
}
