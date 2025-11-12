import { SessionProvider } from "next-auth/react";
import NavBar from "./components/utils/NavBar";
import Header from "./components/utils/Header";
import EncaminhaUser from "./services/encaminhaUser";
export const metadata = {
  title: 'GothicMatch - Encontros Góticos',
  description: 'Conecte-se com pessoas que compartilham do estilo gótico',
  keywords: 'gothic, match, dating, gótico, encontros',
  authors: [{ name: 'GothicMatch Team' }],
  viewport: 'width=device-width, initial-scale=1.0',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Creepster&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="gothic-theme">
        <div id="root">
          <header className="app-header">
            <nav className="navbar">
              <div className="nav-brand">
                <span className="logo-icon"></span>
                <span className="logo-text"></span>
              </div>
            </nav>
          </header>
          <EncaminhaUser>
          <Header />
         </EncaminhaUser>
          <main className="main-content">
            {children}
          </main>


          <footer className="app-footer" style={{ position: "relative" }}>



            <p>&copy; 2025 GothicMatch. Conectando almas .</p>
          </footer>
        </div>
      </body>
    </html>
  );
}