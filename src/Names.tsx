import { useGSAP } from "@gsap/react";
import { justiceleague } from "./justiceleague";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

gsap.registerPlugin(SplitText);

type namesProps = {
  activeHero: number | null;
  nextHero: number | null;
  isHoveringContainer: boolean;
  setActiveHero: (id: number | null) => void;
  setNextHero: (id: number | null) => void;
};

const Names = ({
  activeHero,
  nextHero,
  isHoveringContainer,
  setActiveHero,
  setNextHero,
}: namesProps) => {
  const defaultRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroSplitRef = useRef<SplitText | null>(null);
  const defaultSplitRef = useRef<SplitText | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [displayedHero, setDisplayedHero] = useState<number | null>(null);

  useEffect(() => {
    const isMobileWidth = window.innerWidth < 900;
    setIsMobile(isMobileWidth);

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

  useLayoutEffect(() => {
    if (nextHero === displayedHero && !heroRef.current) return;

    if (isHoveringContainer) {
      if (displayedHero !== nextHero && displayedHero !== null) {
        console.log("animateHeroOut", displayedHero, nextHero);
        animateHeroOut(() => {
          setActiveHero(nextHero);
          setDisplayedHero(nextHero);
        });
        animateHeroIn();
      }
      if (nextHero !== null && displayedHero === null) {
        console.log("animateHeroIn", nextHero);
        setDisplayedHero(nextHero);
        animateHeroIn();
      }
    } else {
      animateHeroOut(() => {
        setActiveHero(null);
        setNextHero(null);
        setDisplayedHero(null);
      });
    }
  }, [nextHero, displayedHero, setActiveHero, setNextHero]);

  useGSAP(() => {
    if (isMobile || !defaultRef.current) return;

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
  }, [activeHero, isHoveringContainer, isMobile]);

  const heroAnimationComplete = useCallback(() => {
    setNextHero(null);
    setActiveHero(displayedHero);
  }, [displayedHero, setActiveHero, setNextHero]);

  // Animation functions
  const animateHeroIn = useCallback(() => {
    if (!heroRef.current || nextHero === null) return;

    // Cleanup previous animation
    if (heroSplitRef.current?.revert) {
      heroSplitRef.current.revert();
    }

    // Set hero content and styles
    const hero = justiceleague[nextHero];
    heroRef.current.innerHTML = hero.name;
    heroRef.current.style.color = hero.mainColor || "#e3e3db";
    heroRef.current.style.fontSize = hero.textSize || "12rem";

    // Force reflow
    void heroRef.current.offsetHeight;

    // Create new animation
    heroSplitRef.current = new SplitText(heroRef.current, { type: "chars" });
    const { chars } = heroSplitRef.current;

    if (chars.length > 0) {
      gsap.to(chars, {
        y: "-100%",
        duration: 0.75,
        ease: "power4.out",
        stagger: {
          each: 0.025,
          from: "center",
        },
        onComplete: heroAnimationComplete,
      });
    }
  }, [nextHero, heroAnimationComplete]);

  const animateHeroOut = (onComplete?: () => void) => {
    if (!heroRef.current || displayedHero === null) return;
    const heroSplit = new SplitText(heroRef.current, {
      type: "chars",
    });
    const heroLetters = heroSplit.chars;

    gsap.fromTo(
      heroLetters,
      {
        y: "0%",
      },
      {
        y: "100%",
        duration: 0.75,
        ease: "power4.out",

        stagger: { each: 0.025, from: "center" },
        onComplete: () => {
          if (onComplete) onComplete();
        },
      }
    );
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
        <h1 ref={heroRef}></h1>
      </div>
    </div>
  );
};

export default Names;
