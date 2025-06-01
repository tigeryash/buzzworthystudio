import { justiceleague } from "./justiceleague";
import gsap from "gsap";

const Images = ({
  setIsHoveringContainer,
  setNextHero,
}: {
  setIsHoveringContainer: (hovering: boolean) => void;
  setNextHero: (id: number | null) => void;
}) => {
  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    id: number
  ) => {
    const img = e.currentTarget;
    setIsHoveringContainer(true);
    setNextHero(id);
    gsap.to(img, {
      width: 140,
      height: 140,
      duration: 0.5,
      ease: "power4.out",
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const img = e.currentTarget;

    gsap.to(img, {
      width: 70,
      height: 70,
      duration: 0.5,
      ease: "power4.out",
    });
  };

  const handleMouseLeaveAll = () => {
    setIsHoveringContainer(false);
    setNextHero(null);
  };

  return (
    <div className="profile-images" onMouseLeave={handleMouseLeaveAll}>
      {justiceleague.map((hero) => (
        <div
          key={hero.id}
          className="img"
          onMouseEnter={(e) => handleMouseEnter(e, hero.id)}
          onMouseLeave={(e) => handleMouseLeave(e)}
        >
          <img src={hero.image} alt={hero.name} />
        </div>
      ))}
    </div>
  );
};

export default Images;
