import type { Metadata } from 'next';
import '@/styles/globals.css';
import { WorkspaceProvider } from '@/lib/context/WorkspaceContext';

export const metadata: Metadata = {
  title: 'DYNAFIN – OPPORTUNITY IQ | Pre-Order Financial Decision Intelligence',
  description:
    "Don't just survive growth. Understand it. Prepare for it. Pursue it. Evaluate the true working capital risk, cash timing, and capacity consequences before accepting a purchase order.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-ivory text-charcoal antialiased selection:bg-amber selection:text-charcoal">
        <WorkspaceProvider>
          {children}
        </WorkspaceProvider>
      </body>
    </html>
  );
}
