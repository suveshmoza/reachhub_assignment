import Navbar from './Navbar';

const Layout = ({ children }) => {
	return (
		<div className="">
			<Navbar />
			<div className="h-[calc(100vh-60px)] px-8">{children}</div>
		</div>
	);
};

export default Layout;
