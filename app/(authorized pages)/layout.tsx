import { Suspense } from "react";
import Loading from "./loading";
import StoreProvider from "@/context/ReduxContext";
import FileViewer from "@/components/FileViewer/FileViewer";
import { WebSocketProvider } from "@/context/WebSocketContext";
import Navbar from "@/components/Navbar/Navbar";
import AuthChecker from '@/components/AuthChecker';
import SideBar from '@/components/SideBar/SideBar';

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<Suspense fallback={<Loading />}> 
			<div className="bg-bgPri">
				{process.env.ENABLE_AUTH === 'true' && <AuthChecker/>}
				<WebSocketProvider>
					<StoreProvider>
						<FileViewer/>
						<div className='flex'>
							<SideBar/>
							<div className='px-10 py-5 flex-1 flex flex-col gap-5'>
								<Navbar/>
								{children}
							</div>
						</div>
					</StoreProvider>
				</WebSocketProvider>
			</div>
		</Suspense>
	);
}
