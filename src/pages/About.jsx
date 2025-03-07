// Uses the same styles as Product
import { ArrowUpRight } from "@phosphor-icons/react";
import GlassCTA from "../components/GlassCTA";
import HomeWrapper from "../components/HomeWrapper";
import {
  ArrowLongRightIcon,
  ChatBubbleLeftEllipsisIcon,
  GlobeEuropeAfricaIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/16/solid";

export default function About() {
  return (
    <HomeWrapper bgImage="/bg/pexels-pnw-prod-8575595.jpg">
      <section>
        <div className="px-[5%] pt-[3%] space-y-11">
          <div>
            <div className="flex items-center gap-3 text-5xl font-bold">
              <span>We Present</span>
              <ArrowLongRightIcon className="w-10" />
              <span className="px-4 flex gap-3">
                <span className="font-yeseva text-pink-500/80">Love</span>{" "}
                without
                <span className="font-yeseva text-blue-800/80 ">borders.</span>
              </span>
            </div>
            <p className="text-xl font-semibold my-3 px-1">
              We connect hearts across the world, helping you find meaningful
              connections, near or far.
            </p>
            <GlassCTA to={"/app"} className="max-w-min">
              <span>Join Us Today</span>
              <ArrowUpRight />
            </GlassCTA>
          </div>
          <div className="backdrop-blur-md overflow-hidden bg-white/10 border-[0.1px] border-white/20 rounded-xl">
            <div className="flex flex-col gap-2 p-6 pt-2 bg-[url('/bg/paper.png')]">
              <div>
                <p className="flex items-end text-xl gap-3 my-3">
                  <span className="text-3xl font-yeseva">Our Mission:</span>
                  <span className="font-semibold">
                    Connecting People, Anywhere in the World...
                  </span>
                </p>
                <div className="text-white/80">
                  <p>
                    We believe love has no limits. Whether you're looking for
                    romance nearby or a match across the world,
                  </p>
                  <p>
                    we make it easy to find and connect with people who share
                    your vibe.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <MissionImage
                  text="Travel With Partners"
                  bgImage="bg-[url('/assets/pexels-katia-miasoed-624959709-17877489.jpg')]"
                />
                <MissionImage
                  text="Explore New Things"
                  bgImage="bg-[url('/assets/pexels-cristian-rojas-8866003.jpg')]"
                />
                <MissionImage
                  text="Visit Serene Places"
                  bgImage="bg-[url('/assets/pexels-ollivves-1020016.jpg')]"
                />
                <MissionImage
                  text="Anywhere on the Globe"
                  bgImage="bg-[url('/assets/pexels-nastyasensei-66707-335393.jpg')]"
                />
              </div>
            </div>
          </div>
          <div>
            <div className="font-yeseva text-2xl px-4 pb-2">
              Our diverse Features and Wide Reach:
            </div>
            <div className="backdrop-blur-md overflow-hidden bg-white/10 border-[0.1px] border-white/20 rounded-xl">
              <div className="bg-[url('/bg/paper.png')] flex items-stretch">
                <IllustrationTab
                  icon={<MagnifyingGlassIcon className="w-16" />}
                >
                  <h1 className="text-xl font-black">Search Anyone</h1>
                  <p>
                    Find users anywhere in the world! Explore matches by
                    searching any location and see their exact spot on the map.
                  </p>
                </IllustrationTab>
                <IllustrationTab
                  icon={<GlobeEuropeAfricaIcon className="w-16 " />}
                >
                  <h1 className="text-xl font-black">
                    Meet a Diverse Community
                  </h1>
                  <p>
                    Connect with people from different cultures and backgrounds.
                    Our diverse user base makes finding love more exciting!
                  </p>
                </IllustrationTab>
                <IllustrationTab
                  icon={<ChatBubbleLeftEllipsisIcon className="w-16" />}
                >
                  <h1 className="text-xl font-black">
                    Chat & Connect Instantly
                  </h1>
                  Start conversations instantly! Message matches directly and
                  build meaningful connections with ease.
                </IllustrationTab>
              </div>
            </div>
          </div>
          <div className="mb-10 px-3 flex items-center gap-3">
            <p className="font-yeseva text-4xl">
              Your Match is Just a Map Away!
            </p>
            <svg
              width="115"
              height="54"
              viewBox="0 0 115 54"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M46.6786 40.3725C61.4066 50.9624 82.5565 47.5399 103.355 31.2411C98.7279 30.1339 93.9338 34.929 89.9424 30.7316C90.0342 29.9344 89.9404 29.1584 90.1618 29.0568C96.7995 26.0063 103.401 22.8583 110.17 20.1196C112.461 19.1925 114.975 20.4224 114.986 23.1219C115.01 28.8057 115.215 34.6018 112.67 41.0744C110.705 38.5065 109.333 36.7145 108.308 35.3744C101.892 39.5994 95.9067 44.2888 89.2735 47.7597C73.6111 55.9552 57.7367 56.4875 42.309 46.9079C39.8651 45.3903 37.9849 45.6834 35.4894 46.507C25.0222 49.9607 15.033 48.6669 6.00484 42.3393C2.72202 40.0383 -0.742138 37.3491 0.139203 31.2108C4.53548 37.4897 9.96866 40.7104 16.4608 42.1416C22.82 43.5437 29.076 43.6636 34.9295 40.5913C33.8745 34.7585 32.1794 29.3042 32.0965 23.8259C32.0135 18.3411 32.8735 12.622 34.5482 7.39248C36.2673 2.02354 41.233 -0.450914 46.0677 0.0673848C50.893 0.584466 54.5306 4.10921 55.5744 9.86832C57.2145 18.9182 55.176 27.3222 50.3493 35.0915C49.2179 36.9128 47.9024 38.6219 46.6786 40.3725ZM42.1427 35.9516C48.4797 28.6021 50.4746 21.0539 49.6739 12.6027C49.4127 9.84581 48.6386 7.07431 45.1988 6.91179C42.2478 6.7724 40.929 9.10946 40.2529 11.497C38.0163 19.3952 38.4462 27.1457 42.1427 35.9516Z"
                className="fill-blue-800/80"
              />
            </svg>
            <GlassCTA to="/login" className="ml-6 w-min">
              Sign Up & Start Exploring
            </GlassCTA>
          </div>
        </div>
      </section>
    </HomeWrapper>
  );
}

function MissionImage({ bgImage, text }) {
  return (
    <div
      className={`relative overflow-hidden basis-[23%] h-96 rounded-2xl flex  px-3 py-3 group text-white/80`}
    >
      <div
        className={`absolute bg-red w-full h-full top-0 left-0 bg-cover bg-center ${bgImage} transition-transform duration-300 ease-in-out scale-100 group-hover:scale-110`}
      ></div>
      <p className="font-yeseva text-3xl z-10">{text}</p>
    </div>
  );
}

function IllustrationTab({ icon, children }) {
  return (
    <div className="grow justify-self-stretch self-stretch flex flex-col gap-7 items-center p-10 bg-white/10 border-r-[0.1px] border-white/20 last:border-r-0">
      <div className="my-3 bg-white/37 p-3 rounded-full">{icon}</div>
      <div>{children}</div>
    </div>
  );
}
