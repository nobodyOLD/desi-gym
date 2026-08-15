import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'DESI GYM — Train Desi. Progress Strong.',
  description: 'Indian-first personalized fitness coaching platform. Structured training programming, Indian nutrition target splits, workout logging, and sports-science progression overload.',
  keywords: 'fitness, gym, workout, Indian nutrition, progressive overload, training splits, strength progression',
  authors: [{ name: 'DESI GYM' }],
  viewport: 'width=device-width, initial-scale=1.0',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-gray-950 text-gray-50">
      <body className={`${inter.className} min-h-full bg-gray-950 text-gray-50 antialiased`}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937', // gray-800
              color: '#f9fafb', // gray-50
              border: '1px solid #374151', // gray-700
            },
            success: {
              iconTheme: {
                primary: '#22c55e', // green-500
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444', // red-500
                secondary: '#ffffff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
