export function Loading({ fullScreen = true }) {
    return (
        <div
            className={`${fullScreen ? "h-screen" : ""} w-full flex flex-col items-center justify-center`}
        >
            <span className="loading loading-ring !w-32 text-primary" />
        </div>
    );
}
