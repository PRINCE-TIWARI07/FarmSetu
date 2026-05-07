"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
          <section style={{ maxWidth: 420, textAlign: "center", fontFamily: "system-ui, sans-serif" }}>
            <p style={{ color: "#16a34a", fontWeight: 600 }}>FarmSetu</p>
            <h1 style={{ marginTop: 12, fontSize: 28 }}>We hit a temporary issue.</h1>
            <p style={{ marginTop: 12, color: "#475569", lineHeight: 1.6 }}>
              Retry the page once. The app is designed to recover cleanly during demos.
            </p>
            <button
              onClick={reset}
              style={{
                marginTop: 24,
                minHeight: 44,
                borderRadius: 999,
                border: 0,
                padding: "0 20px",
                background: "#16a34a",
                color: "white",
                fontWeight: 600,
              }}
            >
              Try again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
