export default function About() {
  return (
    <>
      <h1>About Eventify</h1>
      <p>
        Eventify is an event booking platform that connects people with great experiences.
        Our goal is to make discovering and booking events simple, fast and enjoyable.
      </p>
      <div className="grid-3 section">
        <div className="card">
          <h3>Our Mission</h3>
          <p className="muted">Bring people together through great events.</p>
        </div>
        <div className="card">
          <h3>Our Vision</h3>
          <p className="muted">Be the leading event platform in the region.</p>
        </div>
        <div className="card">
          <h3>Our Values</h3>
          <p className="muted">Trust, innovation and a focus on the customer.</p>
        </div>
      </div>
    </>
  );
}
