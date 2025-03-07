import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import Image from "next/image";
const reviews = [
  {
    name: "Emily",
    username: "@emily_dev",
    body: "Building APIs for live cricket scores used to take me days. This service gives me real-time data in seconds. Absolutely love it!",
    img: "https://avatar.vercel.sh/emily",
  },
  {
    name: "Ryan",
    username: "@ryan_codes",
    body: "I never thought getting stock prices in my app would be this simple. No backend knowledge, just plug and play!",
    img: "https://avatar.vercel.sh/ryan",
  },
  {
    name: "Sophia",
    username: "@sophia_business",
    body: "As a business owner, I needed weather data for my app but had no coding experience. This service made it effortless!",
    img: "https://avatar.vercel.sh/sophia",
  },
  {
    name: "Mark",
    username: "@mark_api",
    body: "Finally, a solution that removes the complexity of API development. Real-time data with zero backend headaches!",
    img: "https://avatar.vercel.sh/mark",
  },
  {
    name: "Liam",
    username: "@liam_dev",
    body: "I integrated live stock prices into my app in under 5 minutes. The API is super clean and easy to use!",
    img: "https://avatar.vercel.sh/liam",
  },
  {
    name: "Olivia",
    username: "@olivia_codes",
    body: "Real-time APIs without writing backend code? This service made my app development journey 10x faster!",
    img: "https://avatar.vercel.sh/olivia",
  },
  {
    name: "Ethan",
    username: "@ethan_tech",
    body: "No more wasting time on backend setup. This service is perfect for developers who want to focus on building apps.",
    img: "https://avatar.vercel.sh/ethan",
  },
  {
    name: "Ava",
    username: "@ava_nocode",
    body: "I built a weather app without writing any backend code. This service makes APIs accessible to everyone!",
    img: "https://avatar.vercel.sh/ava",
  },
];

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative mx-2 h-full w-72 cursor-pointer overflow-hidden rounded-xl border p-4 transition-all duration-300",
        "border-gray-700/[.3] bg-white/[.05] hover:bg-white/[.1]",
        "text-white",
      )}
    >
      <div className="mb-3 flex flex-row items-center gap-2">
        <Image
          className="rounded-full"
          width="40"
          height="40"
          alt={`${name}'s avatar`}
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-semibold text-white">
            {name}
          </figcaption>
          <p className="text-xs text-white/60">{username}</p>
        </div>
      </div>
      <blockquote className="text-sm italic text-white/90">
        &quot;{body}&quot;
      </blockquote>
    </figure>
  );
};

export function MarqueeComponent() {
  const firstRow = reviews.slice(0, reviews.length / 2);
  const secondRow = reviews.slice(reviews.length / 2);

  return (
    <div className="relative w-full overflow-hidden bg-[#030619] py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="heading mb-12 text-3xl font-bold text-white md:text-4xl">
          What Our Users Say
        </h2>

        <div className="relative w-full">
          <Marquee pauseOnHover className="[--duration:30s] [--gap:1rem]">
            {[...firstRow, ...firstRow].map((review, index) => (
              <ReviewCard key={index} {...review} />
            ))}
          </Marquee>

          <Marquee
            reverse
            pauseOnHover
            className="mt-4 [--duration:30s] [--gap:1rem]"
          >
            {[...secondRow, ...secondRow].map((review, index) => (
              <ReviewCard key={index} {...review} />
            ))}
          </Marquee>
        </div>
      </div>

      {/* Gradient overlay for fade effect */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-[#030619] to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-[#030619] to-transparent"></div>
    </div>
  );
}

export default MarqueeComponent;
