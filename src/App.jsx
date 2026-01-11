export default function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="brand">ABSMEDIQ</div>
          <nav className="nav">
            <a href="#hero">Home</a>
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <section id="hero" className="section hero">
          <div className="container">
            <h1>Welcome to ABSMEDIQ</h1>
            <p>A clean single-page start powered by Vite + React.</p>
            <div className="cta">
              <a className="button" href="#features">Explore Features</a>
            </div>
          </div>
        </section>

        <section id="about" className="section">
          <div className="container">
            <h2>About</h2>
            <p>
              This project is a minimal Single Page Application template. Use it as a
              foundation to build your product quickly.
            </p>
          </div>
        </section>

        <section id="features" className="section">
          <div className="container">
            <h2>Features</h2>
            <ul className="features">
              <li>Fast dev environment with Vite</li>
              <li>Modern React setup</li>
              <li>Clean, responsive layout</li>
              <li>Single-page navigation</li>
            </ul>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="container">
            <h2>Contact</h2>
            <p>
              Have questions or ideas? Add your contact info or form here.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <small>© {new Date().getFullYear()} ABSMEDIQ</small>
          <a className="back-to-top" href="#hero">Back to top</a>
        </div>
      </footer>
    </div>
  )
}
