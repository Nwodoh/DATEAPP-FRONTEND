import { ArrowUpRight } from "@phosphor-icons/react";
import HomeWrapper from "../components/HomeWrapper";
import GlassCTA from "../components/GlassCTA";

export default function Homepage() {
  return (
    <HomeWrapper bgImage="/bg/pexels-maksgelatin-4348786-1.jpg">
      <section>
        <div className="px-[5%] pt-[3%] flex">
          <div className="flex flex-col gap-1 text-white basis-[55%] justify-center">
            <span className="text-8xl font-extrabold">
              Find Your Match, Near or Far!
            </span>
            <br />
            <span className="text-lg max-w-[60%]">
              Explore connections around you or anywhere in the world using our
              interactive map.
            </span>
          </div>
          <div className="flex grow items-end justify-end gap-7 pb-8">
            <GlassCTA to={"/about"} className="before:bg-pink-500/80">
              <span>See How It Works</span>
              <ArrowUpRight />
            </GlassCTA>
            <GlassCTA to={"/app"}>
              <span>Start Matching Now</span>
              <ArrowUpRight />
            </GlassCTA>
          </div>
        </div>
      </section>
    </HomeWrapper>
  );
}

// Photo by Taryn Elliott: https://www.pexels.com/photo/a-couple-sitting-on-cliff-having-a-picnic-4390580/
// Photo by Maksim Goncharenok: https://www.pexels.com/photo/couple-lying-down-eating-pizza-4348786/
// Photo by Flo Maderebner: https://www.pexels.com/photo/man-and-woman-sitting-on-brown-wooden-dock-340566/
// Photo by Arthur Brognoli: https://www.pexels.com/photo/couple-on-top-of-rocks-2386832/
// Photo by Mikhail Nilov: https://www.pexels.com/photo/people-standing-outside-with-their-pets-6530675/
// Photo by Mikhail Nilov: https://www.pexels.com/photo/people-sitting-on-snow-covered-ground-6530651/
// Photo by PNW Production: https://www.pexels.com/photo/a-man-drinking-a-beverage-from-a-plastic-cup-8575595/
// Photo by Tima Miroshnichenko: https://www.pexels.com/photo/cold-snow-road-person-7009599/

// Photo by NastyaSensei: https://www.pexels.com/photo/close-up-of-globe-335393/
// Photo by <a href="https://unsplash.com/@lanirudhreddy?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">ANIRUDH</a> on <a href="https://unsplash.com/photos/a-view-of-the-earth-from-space-at-night-Xu4Pz7GI9JY?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
// Photo by Mikhail Nilov: https://www.pexels.com/photo/couple-standing-outside-of-the-hotel-7820925/
// Photo by Oliver Sjöström: https://www.pexels.com/photo/two-person-carrying-black-inflatable-pool-float-on-brown-wooden-bridge-near-waterfalls-1020016/
// Photo by Los Muertos Crew: https://www.pexels.com/photo/a-man-and-a-woman-standing-inside-a-campervan-8866003/
// Photo by RDNE Stock project: https://www.pexels.com/photo/a-couple-drinking-together-8231017/
// Photo by Yuri Catalano: https://www.pexels.com/photo/man-and-woman-holding-hands-127420/
// Photo by Katia Miasoed: https://www.pexels.com/photo/young-couple-and-an-airport-runway-in-the-background-17877489/
