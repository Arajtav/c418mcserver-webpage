export function Sidebar({children, links}: {children?: React.ReactNode, links: {title: string, href: string}[]}) {
    return (
        <nav className="h-full portrait:h-fit w-72 portrait:w-full bg-neutral-800/70 backdrop-blur-xl flex flex-col justify-between drop-shadow-md">
            <div className="w-full flex items-center justify-center flex-col">
                {children}
            </div>
            <div className="w-full flex items-start justify-center flex-col text-2xl">
                {links.map((ln, i) => {
                    return <a key={i} href={ln.href} className="p-4 h-16 drop-shadow-sm text-neutral-400 hover:text-neutral-300">{ln.title}</a>
                })}
            </div>
        </nav>
    );
}
