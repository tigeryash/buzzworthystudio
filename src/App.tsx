import { useState } from "react";
import Images from "./Images";
import Names from "./Names";

function App() {
  const [hoveredHero, setHoveredHero] = useState<number | null>(null);
  return (
    <section className="team">
      <Images setHoveredHero={setHoveredHero} />
      <Names hoveredHero={hoveredHero} />
    </section>
  );
}

export default App;
