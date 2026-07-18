import "./Header.css";

function Header() {
  return (
    <header className="hero">

      <div className="hero-title">

        <span className="hero-icon">
         🤖
        </span>

        <h1>
          AI Document Summarizer
        </h1>

      </div>

      <p>
        Transform lengthy documents into clear, concise insights in seconds.
      </p>

    </header>
  );
}

export default Header;