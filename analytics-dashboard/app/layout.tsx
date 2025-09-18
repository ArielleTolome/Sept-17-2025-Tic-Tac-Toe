export const metadata = { title: 'TTT Analytics Dashboard' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: '#0b0f19', color: '#f4f7ff', fontFamily: 'system-ui, sans-serif' }}>
        <main style={{ maxWidth: 1200, margin: '0 auto', padding: 16 }}>{children}</main>
      </body>
    </html>
  );
}

