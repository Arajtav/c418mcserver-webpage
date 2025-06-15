export default function NotFound() {
    return (
        <div className="w-screen h-screen overflow-clip flex items-center justify-center text-neutral-400 text-2xl">
            <div className="w-2/3 md:w-1/3 h-1/4 glass flex items-center justify-center flex-col">
                <div>404 - Page not found</div>
                <a href="/" className="underline drop-shadow-xs hover:text-neutral-300">Go to the main page.</a>
            </div>
        </div>
    );
}
