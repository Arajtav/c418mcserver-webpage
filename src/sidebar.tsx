export function Sidebar({
    children,
    links,
}: {
    children?: React.ReactNode;
    links: { title: string; href: string | (() => void) }[];
}) {
    return (
        <nav className="h-full portrait:h-fit w-72 portrait:w-full glass flex flex-col justify-between drop-shadow-md">
            <div className="w-full flex items-center justify-center flex-col">{children}</div>
            <div className="w-full flex items-start justify-center flex-col text-2xl">
                {links.map((ln, i) => {
                    if (typeof ln.href === "string") {
                        return (
                            <a
                                key={i}
                                href={ln.href}
                                className="p-4 h-16 drop-shadow-xs text-neutral-400 hover:text-neutral-300"
                            >
                                {ln.title}
                            </a>
                        );
                    }

                    return (
                        <button
                            key={i}
                            onClick={ln.href}
                            className="p-4 h-16 drop-shadow-xs text-neutral-400 hover:text-neutral-300 cursor-pointer"
                        >
                            {ln.title}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
