import { useState } from "react";
import Images from "./Images";
import Names from "./Names";
import { justiceleague } from "./justiceleague";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function App() {
  const [activeHero, setActiveHero] = useState<number | null>(null); // Currently displayed hero
  const [nextHero, setNextHero] = useState<number | null>(null); // Next hero to display
  const [isHoveringContainer, setIsHoveringContainer] = useState(false);

  useGSAP(() => {
    const currentHover = nextHero !== null ? nextHero : activeHero;
    if (currentHover !== null && isHoveringContainer) {
      gsap.to(".team", {
        backgroundColor: justiceleague[currentHover].secondaryColor,
        duration: 0.2,
        ease: "power4.out",
      });
    } else {
      gsap.to(".team", {
        backgroundColor: "#000",
        duration: 0.2,
        ease: "power4.out",
      });
    }
  }, [nextHero, isHoveringContainer]);

  return (
    <section className="team">
      <Images
        setIsHoveringContainer={setIsHoveringContainer}
        setNextHero={setNextHero}
      />
      <Names
        activeHero={activeHero}
        nextHero={nextHero}
        setNextHero={setNextHero}
        isHoveringContainer={isHoveringContainer}
        setActiveHero={setActiveHero}
      />
    </section>
  );
}

export default App;
