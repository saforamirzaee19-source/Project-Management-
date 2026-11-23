import "./globals.css";
import Providers from "./providers.jsx";

export const metadata = {
  title: "Forma",
  description: "A calmer way to manage projects and tasks.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
