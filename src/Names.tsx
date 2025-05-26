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
    const newHeroSplit = new SplitText(heroRef.current, {
      type: "chars",
    });
    newHeroSplit.chars.forEach((char) => char.classList.add("letter"));

    const defaultLetters = defaultRef.current.querySelectorAll(".letter");
    const heroLetters = heroRef.current.querySelectorAll(".letter");
    gsap.killTweensOf([...defaultLetters, ...heroLetters]);

    gsap.to(defaultLetters, {
      y: isHoveringContainer ? "-125%" : "0%",
      duration: 0.75,
      ease: "power4.out",
      stagger: {
        each: 0.025,
        from: "center",
      },
    });

    if (nextHero !== null && nextHero !== activeHero) {
      setIsAnimating(true);

      // If there's an active hero, animate it out first
      if (activeHero !== null) {
        gsap.to(heroLetters, {
          y: "100%",
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
          onComplete: () => {
            setActiveHero(nextHero);
            setNextHero(null);
            // Animate new hero in
            animateHeroIn();
          },
        });
      } else {
        // No active hero, just animate in
        setActiveHero(nextHero);
        setNextHero(null);
        animateHeroIn();
      }
    } else if (activeHero !== null && !isHoveringContainer) {
      // Animate out when leaving container
      gsap.to(heroLetters, {
        y: "100%",
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          setActiveHero(null);
          setIsAnimating(false);
        },
      });
    }
  }, [activeHero, isHoveringContainer, isAnimating, isMobile]);

  const animateHeroIn = () => {
    const heroLetters = heroRef.current?.querySelectorAll(".letter");
    if (heroLetters) {
      gsap.fromTo(
        heroLetters,
        { y: "50%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 0.75,
          ease: "power3.out",
          stagger: { each: 0.02 },
          onComplete: () => setIsAnimating(false),
        }
      );
    }
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
