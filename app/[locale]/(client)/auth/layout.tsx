export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="h-screen overflow-hidden bg-slate-50">
        {children}
      </body>
    </html>
  );
}
