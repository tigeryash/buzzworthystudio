import { useGSAP } from "@gsap/react";
import { justiceleague } from "./justiceleague";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(SplitText);

const Names = ({ hoveredHero }: { hoveredHero: number | null }) => {
  const defaultRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 900;
    setIsMobile(isMobile);

    // Initialize SplitText on mount
    if (defaultRef.current) {
      const split = new SplitText(defaultRef.current, { type: "chars" });
      split.chars.forEach((char) => {
        char.classList.add("letter");
      });

      // Cleanup function to revert SplitText when component unmounts
      return () => {
        if (split.revert) split.revert();
      };
    }
  }, []);

  useGSAP(() => {
    if (isMobile) return;

    if (hoveredHero === null && defaultRef.current) {
      gsap.set(defaultRef.current?.querySelectorAll(".letter"), {
        y: "100%",
      });
    } else if (heroRef.current) {
      gsap.set(heroRef.current?.querySelectorAll(".letter"), {
        y: "0%",
        ease: "power4.out",
        duration: 0.75,
        stagger: {
          each: 0.025,
          from: "center",
        },
      });
    }
  }, [hoveredHero]);

  return (
    <div className="profile-names">
      <div className="name default">
        <h1 ref={defaultRef}>Justice League</h1>
      </div>
      {hoveredHero !== null && (
        <div className="name">
          <h1 ref={heroRef}>{justiceleague[hoveredHero].name}</h1>
        </div>
      )}
    </div>
  );
};

export default Names;
