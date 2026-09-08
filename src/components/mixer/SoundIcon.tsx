import { Bird, Bug, CloudRain, Flame, Truck, Waves, Wind, AudioLines } from "lucide-react";
import type { SoundIconName } from "@/lib/sounds";

const MAP = {
  rain: CloudRain,
  bird: Bird,
  wind: Wind,
  waves: Waves,
  flame: Flame,
  truck: Truck,
  bug: Bug,
  om: AudioLines,
} as const;

export function SoundIcon({
  name,
  className,
  size = 18,
}: {
  name: SoundIconName;
  className?: string;
  size?: number;
}) {
  const Cmp = MAP[name] ?? CloudRain;
  return <Cmp aria-hidden="true" size={size} strokeWidth={1.6} className={className} />;
}
