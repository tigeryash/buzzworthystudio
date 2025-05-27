import { useGSAP } from "@gsap/react";
import { justiceleague } from "./justiceleague";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(SplitText);

const Names = ({
  activeHero,
  nextHero,
  isHoveringContainer,
  isAnimating,
  setIsAnimating,
  setActiveHero,
  setNextHero,
}: {
  activeHero: number | null;
  nextHero: number | null;
  isHoveringContainer: boolean;
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
  setActiveHero: (id: number | null) => void;
  setNextHero: (id: number | null) => void;
}) => {
  const defaultRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 900;
    setIsMobile(isMobile);

    if (defaultRef.current && heroRef.current) {
      // // Default text (Justice League)
      const defaultSplit = new SplitText(defaultRef.current, {
        type: "chars",
      });
      defaultSplit.chars.forEach((char) => char.classList.add("letter"));

      // // Initial state

      gsap.set(defaultRef.current, {
        y: "25%",
      });

      // Cleanup
      return () => {
        if (defaultSplit.revert) defaultSplit.revert();
      };
    }
  }, []);

  useGSAP(() => {
    if (isMobile || !defaultRef.current || !heroRef.current) return;

    // Create new SplitText
    const heroSplit = new SplitText(heroRef.current, { type: "chars" });
    heroSplit.chars.forEach((char) => char.classList.add("letter"));

    // Get the newly created letters
    const heroLetters = heroRef.current.querySelectorAll(".letter");
    const defaultLetters = defaultRef.current.querySelectorAll(".letter");

    gsap.to(defaultLetters, {
      y: isHoveringContainer ? "-125%" : "0%",
      duration: 0.75,
      ease: "power4.out",
      stagger: {
        each: 0.025,
        from: "center",
      },
    });
    if (nextHero !== null) {
      // New hero is being hovered
      setIsAnimating(true);

      // If there's an active hero, animate it out first
      if (activeHero !== null) {
        animateHeroOut(() => {
          setActiveHero(nextHero);
          setNextHero(null);
          animateHeroIn();
        });
      } else {
        // No active hero, just animate in
        setActiveHero(nextHero);
        setNextHero(null);
        animateHeroIn();
      }
    }
    // If no nextHero but still in container, check if we need to hide active hero
    else if (!isHoveringContainer && activeHero !== null) {
      animateHeroOut(() => {
        setActiveHero(null);
      });
    }
  }, [activeHero, isHoveringContainer, isAnimating, isMobile]);

  const animateHeroIn = () => {
    if (!heroRef.current) return;

    // Clean up any existing split text
    const existingSplit = SplitText.getSplit(heroRef.current);
    if (existingSplit) existingSplit.revert();

    // Create new split text
    const heroSplit = new SplitText(heroRef.current, { type: "chars" });
    heroSplit.chars.forEach((char) => char.classList.add("letter"));

    // Get letters and set initial state
    const heroLetters = heroRef.current.querySelectorAll(".letter");
    gsap.set(heroLetters, { y: "100%", opacity: 0 });

    gsap.to(heroLetters, {
      y: "-100%",
      opacity: 1,
      duration: 0.75,
      ease: "power4.out",
      stagger: { each: 0.025, from: "center" },
      onComplete: () => setIsAnimating(false),
    });
  };

  const animateHeroOut = (onComplete?: () => void) => {
    if (!heroRef.current) return;

    const heroLetters = heroRef.current.querySelectorAll(".letter");
    if (heroLetters.length === 0) {
      onComplete();
      return;
    }

    gsap.to(heroLetters, {
      y: "-100%",
      opacity: 1,
      duration: 0.75,
      ease: "power4.out",
      stagger: { each: 0.025, from: "center" },
      onComplete: () => {
        setIsAnimating(false);
        if (onComplete) onComplete();
      },
    });
  };

  return (
    <div className="profile-names">
      <div className="name default">
        <h1
          className="text-[12rem]! lg:text-[13rem]! xl:text-[15rem]! 2xl:text-[16rem]! "
          ref={defaultRef}
        >
          Justice League
        </h1>
      </div>

      <div className="name">
        <h1
          ref={heroRef}
          className={`text-[${
            activeHero !== null ? justiceleague[activeHero].textSize : "12rem"
          }]`}
          style={{
            color:
              activeHero !== null
                ? justiceleague[activeHero].mainColor
                : "#e3e3db",
          }}
        >
          {activeHero !== null ? justiceleague[activeHero].name : ""}
        </h1>
      </div>
    </div>
  );
};

export default Names;
