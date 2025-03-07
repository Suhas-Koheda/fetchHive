import FlowingMenu from "./FlowingMenu";

const demoItems = [
  {
    link: "#",
    text: "Krish Kalaria",
    image: "https://picsum.photos/600/400?random=1",
  },
  {
    link: "#",
    text: "Aryan Sharma",
    image: "https://picsum.photos/600/400?random=2",
  },
  {
    link: "#",
    text: "Rakshana V",
    image: "https://picsum.photos/600/400?random=3",
  },
  {
    link: "#",
    text: "Suhas Koheda",
    image: "https://picsum.photos/600/400?random=4",
  },
];

export default function FlowingMenuComponent() {
  return (
    <div className="flex h-[600px] flex-col items-center justify-center bg-[#030619] text-white">
      <h2 className="mb-6 text-center text-2xl font-bold">
        Meet Our Talented Team
      </h2>
      <div className="relative h-full w-full">
        <FlowingMenu items={demoItems} />
      </div>
    </div>
  );
}
