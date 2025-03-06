import { HydrateClient } from "@/trpc/server";
import SpotlightComponent from "@/features/home/ui/spotlight/SpotlightComponent";
import LampComponent from "@/features/home/ui/lamp/LampComponent";
import {ToolTipComponent} from "@/features/home/ui/tooltip/ToolTipComponent";
import MarqueeComponent from "@/features/home/ui/marquee/Marquee";
import FlowingMenuComponent from "@/features/home/ui/flowingmenu/FlowingMenuComponent";
import CompareComponent from "@/features/home/ui/compare/CompareComponent";
import Navbar from "@/features/home/ui/navbar/navbar";
import { BackgroundLinesComponent } from "@/features/home/ui/bg/bgComponent";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });

  // void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="">
        <Navbar/>
        <SpotlightComponent/>
        <LampComponent/>
        <CompareComponent/>
        <ToolTipComponent/>
        <MarqueeComponent/>
        <BackgroundLinesComponent/>
        <FlowingMenuComponent/>
      </main>
    </HydrateClient>
  );
}