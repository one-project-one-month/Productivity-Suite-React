// components/CategoryCard/icons.ts
import {
  Briefcase,
  User,
  Lightbulb,
  Plane,
  ShoppingCart,
  Dumbbell,
  DollarSign,
  BookOpen,
  Folder,
  Utensils,
  Calendar,
  HeartPulse,
  PawPrint,
  Music,
  Film,
  Code,
  School,
  Paintbrush,
  Home,
  Leaf,
  Heart,
  type LucideIcon,
} from "lucide-react";

const keywordToIconMap: Record<string, LucideIcon> = {
  work: Briefcase,
  personal: User,
  idea: Lightbulb,
  travel: Plane,
  trip: Plane,
  shopping: ShoppingCart,
  gym: Dumbbell,
  fitness: Dumbbell,
  finance: DollarSign,
  money: DollarSign,
  budget: DollarSign,
  book: BookOpen,
  study: School,
  read: BookOpen,
  recipe: Utensils,
  food: Utensils,
  meal: Utensils,
  event: Calendar,
  schedule: Calendar,
  health: HeartPulse,
  doctor: HeartPulse,
  pet: PawPrint,
  dog: PawPrint,
  cat: PawPrint,
  music: Music,
  movie: Film,
  film: Film,
  code: Code,
  dev: Code,
  design: Paintbrush,
  art: Paintbrush,
  home: Home,
  garden: Leaf,
  eco: Leaf,
  love: Heart,
  date: Heart,
};

export const getCategoryIcon = (name: string): LucideIcon => {
  const lowerName = name.toLowerCase();
  const keyword = Object.keys(keywordToIconMap).find((key) =>
    lowerName.includes(key)
  );
  return keywordToIconMap[keyword || ""] || Folder;
};
