import Link from "next/link";

import "@/lib/db";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6">
      <div className=" my-auto *:font-medium flex flex-col items-center gap-2">
        <span className="text-9xl">🥕</span>
        <h1 className="text-4xl mt-5">Carrot</h1>
        <h2 className="text-2xl">Welcome to the Carrot Market!</h2>
      </div>
      <div className="flex flex-col items-center gap-3 w-full">
        <Link href="/create-account" className="primary-btn py-2.5 text-lg">
          Create account
        </Link>
        <div className="flex gap-2">
          <span>Already have an account?</span>
          <Link
            href="/login"
            className=" hover:underline hover:underline-offset-4"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
