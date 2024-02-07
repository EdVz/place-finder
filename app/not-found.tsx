import Link from "next/link";
import { Logo } from "./(auth)/_components/Logo";

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center mt-24 space-y-6">
            <Logo />
            <div className="flex flex-col items-center">
                <h3 className="text-xl">
                    Oops! It looks like the page you are looking for does not exist
                </h3>
                <Link
                    href='/'
                    className=""
                >
                    <p className="text-sm underline">Return to home</p>
                </Link>
            </div>
        </div>
    )
}