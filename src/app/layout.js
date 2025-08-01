import "./globals.css";

export const metadata = {
	title: "HPiano",
	description: "Hugo's Piano",
	icons: {
		icon: "/favicon.ico",
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`antialiased`}>{children}</body>
		</html>
	);
}
