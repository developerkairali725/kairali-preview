export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#FFFDF7",
        color: "#1A2E1A",
      }}
    >
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ letterSpacing: "0.2em", fontSize: "0.75rem", textTransform: "uppercase" }}>
          Kairali Web Factory
        </p>
        <h1 style={{ fontSize: "2rem", margin: "0.5rem 0" }}>Fleet Pulse</h1>
        <p style={{ opacity: 0.7 }}>
          Internal dashboard — sprint of 13 Jul to 12 Aug 2026. Deployment chain verified.
        </p>
      </div>
    </main>
  );
}
