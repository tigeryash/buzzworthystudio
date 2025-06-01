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
  setActiveHero,
  setNextHero,
}: {
  activeHero: number | null;
  nextHero: number | null;
  isHoveringContainer: boolean;
  setActiveHero: (id: number | null) => void;
  setNextHero: (id: number | null) => void;
}) => {
  const defaultRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [displayedHero, setDisplayedHero] = useState<number | null>(null);

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

  useEffect(() => {
    if (nextHero !== null && activeHero === null) {
      setDisplayedHero(nextHero);
    }
    if (displayedHero === activeHero) {
    }
  }, [nextHero, activeHero]);

  useGSAP(() => {
    if (isMobile || !defaultRef.current || !heroRef.current) return;

    // Get the newly created letters
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

    if (activeHero === null && nextHero !== null) {
      setActiveHero(nextHero);
      animateHeroIn();
      setNextHero(null);
    }
    if (activeHero !== null && !isHoveringContainer && nextHero !== null) {
      animateHeroOut(() => {
        setActiveHero(null);
      });
    }
    if (activeHero !== null && activeHero !== displayedHero) {
      animateHeroOut(() => {
        setActiveHero(nextHero);
        setNextHero(null);
        animateHeroIn();
      });
    }
  }, [activeHero, isHoveringContainer, isMobile]);

  const animateHeroIn = () => {
    if (!heroRef.current) return;
    const split = SplitText.create(heroRef.current);
    const heroLetters = split.chars;
    console.log("heroLetters", heroLetters);
    if (heroLetters.length === 0) {
      return;
    }

    gsap.to(heroLetters, {
      y: "-110%",
      duration: 0.75,
      ease: "power4.out",
      stagger: { each: 0.025, from: "center" },
      onComplete: () => {
        console.log("animateHeroIn onComplete");
      },
    });
  };

  const animateHeroOut = (onComplete?: () => void) => {
    if (!heroRef.current) return;
    const split = SplitText.create(heroRef.current);
    const heroLetters = split.chars;
    console.log("heroLetters", heroLetters);
    if (heroLetters.length === 0) {
      return;
    }

    gsap.to(heroLetters, {
      y: "0%",
      duration: 0.75,
      ease: "power4.out",
      stagger: { each: 0.025, from: "center" },
      onComplete: () => {
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
            displayedHero !== null
              ? justiceleague[displayedHero].textSize
              : "12rem"
          }]`}
          style={{
            color:
              displayedHero !== null
                ? justiceleague[displayedHero].mainColor
                : "#e3e3db",
          }}
        >
          {displayedHero !== null ? justiceleague[displayedHero].name : ""}
        </h1>
      </div>
    </div>
  );
};

export default Names;
