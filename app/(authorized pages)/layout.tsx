import { Suspense } from "react";
import Loading from "./loading";
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
				<AuthChecker/>
				<div className='flex'>
					<SideBar/>
					<div className='px-10 py-5 flex-1 flex flex-col gap-5'>
						<Navbar/>
						{children}
					</div>
				</div>
			</div>
		</Suspense>
	);
}
