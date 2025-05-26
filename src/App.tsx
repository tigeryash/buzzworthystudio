import { useState } from "react";
import Images from "./Images";
import Names from "./Names";

function App() {
  const [activeHero, setActiveHero] = useState<number | null>(null); // Currently displayed hero
  const [nextHero, setNextHero] = useState<number | null>(null); // Next hero to display
  const [isHoveringContainer, setIsHoveringContainer] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  return (
    <section className="team">
      <Images
        setIsHoveringContainer={setIsHoveringContainer}
        setIsAnimating={setIsAnimating}
        setNextHero={setNextHero}
      />
      <Names
        activeHero={activeHero}
        nextHero={nextHero}
        setNextHero={setNextHero}
        isHoveringContainer={isHoveringContainer}
        isAnimating={isAnimating}
        setIsAnimating={setIsAnimating}
        setActiveHero={setActiveHero}
      />
    </section>
  );
}

export default App;
