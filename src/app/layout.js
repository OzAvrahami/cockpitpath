import "./globals.css";

export const metadata = {
  title: "CockpitPath",
  description: "A connected aircraft-learning platform for flight simulation users.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
