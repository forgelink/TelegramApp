import { Link } from "@tanstack/react-router";

export default function mobileNavigation() {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-card py-5 px-5 w-full flex items-center justify-between gap-2">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>

        </div>
    );
}
