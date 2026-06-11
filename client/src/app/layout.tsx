/**
 * Root layout for the application.
 * Will contain ThemeProvider, AuthProvider, and ToastProvider.
 */
import './globals.css';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* TODO: Add Providers here */}
        {children}
      </body>
    </html>
  );
}
