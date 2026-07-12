// Nothing to render on purpose — this project only exists to run
// `npx shadcn add` against the local registry and inspect what lands in
// src/components/knock-codes. See ../README.md.
function App() {
  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <p>registry-test: install something, then check src/components/knock-codes.</p>
    </div>
  );
}

export default App;
