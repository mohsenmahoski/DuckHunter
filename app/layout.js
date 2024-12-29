export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{  overflow: "hidden" }}>
      <body style={{ margin: 0 }}>
        {children}
        <script src="duckhunt.js"></script>
      </body>
    </html>
  );
}
