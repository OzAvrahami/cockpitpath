import "./globals.css";
import { Archivo, IBM_Plex_Mono } from "next/font/google";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-public-mono",
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "CockpitPath",
  description: "A connected aircraft-learning platform for flight simulation users.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${ibmPlexMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
