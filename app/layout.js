import './globals.css';

export const metadata = {
    title: 'Helping Hands',
    description: 'A TCG Hand Statistics Simulator',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`antialiased`}>{children}</body>
        </html>
    );
}
