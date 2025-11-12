import { HTMLAttributes, type FC } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/atoms/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/utils";

const carouselImages = [
  {
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1471&auto=format&fit=crop",
    alt: "Team collaboration",
    title: "Collaborate Seamlessly",
    description: "Work together with your team in real-time",
  },
  {
    src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1374&auto=format&fit=crop",
    alt: "Business success",
    title: "Achieve Your Goals",
    description: "Track progress and reach new milestones",
  },
  {
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1470&auto=format&fit=crop",
    alt: "Modern workspace",
    title: "Stay Organized",
    description: "Manage your projects efficiently",
  },
];

export type LoginSliderProps = HTMLAttributes<HTMLDivElement> & {};

export const LoginSlider: FC<LoginSliderProps> = ({ className }) => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
      className={cn("h-full w-full", className)}
    >
      <CarouselContent className="ml-0 h-full">
        {carouselImages.map((image, index) => (
          <CarouselItem key={index} className="h-full pl-0">
            <div className="relative h-full w-full">
              {/* Image */}
              <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Content */}
              <div className="absolute right-0 bottom-0 left-0 p-8 text-white">
                <h3 className="mb-2 text-3xl font-bold">{image.title}</h3>
                <p className="text-lg text-white/90">{image.description}</p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Navigation */}
      {carouselImages.length > 1 && (
        <div className="absolute right-8 bottom-8 flex gap-2">
          <CarouselPrevious className="relative inset-0 translate-x-0 translate-y-0 border-white/40 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30" />
          <CarouselNext className="relative inset-0 translate-x-0 translate-y-0 border-white/40 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30" />
        </div>
      )}
    </Carousel>
  );
};
