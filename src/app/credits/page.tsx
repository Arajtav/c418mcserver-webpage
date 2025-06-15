import { Sidebar } from "@/sidebar";

export default function Page() {
    return (
        <div className="w-screen h-screen overflow-clip flex flex-row portrait:flex-col">
            <Sidebar links={[{title: "HOME", href: "/"}]}/>
            <main className="h-full grow overflow-clip portrait:p-2 p-2 md:p-4 lg:p-8 text-neutral-400">
                <div className="relative p-2 w-full h-full glass flex flex-col items-start justify-between">
                    <table className="w-full sm:w-1/2 md:w-1/4 text-2xl">
                        <tbody>
                            <tr>
                                <td>Design:</td>
                                <td>Aräjtav</td>
                            </tr>
                            <tr>
                                <td>Code:</td>
                                <td>Aräjtav</td>
                            </tr>
                        </tbody>
                    </table>
                    <a href="https://github.com/Arajtav/c418mcserver_webpage" className="text-base lg:text-lg xl:text-2xl drop-shadow-xs hover:text-neutral-300">Licensed under MIT license</a>
                    <a className="absolute right-2 bottom-2" href="https://arajtav.com"><img className="w-[88px] h-[31px] flex items-end justify-end hover:brightness-125" src="https://arajtav.com/img/8831.gif" alt="Aräjtav" /></a>
                </div>
            </main>
        </div>
    )
}
