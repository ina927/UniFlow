import { 
  ACADEMIC, 
  ADMIN, 
  IImage, 
  LOGO, 
  PLANNER, 
  PROFILE, 
  TIMER, 
} from "../consts";

export enum NavbarGroup {
  ALL = "ALL",
  DEV = "DEV",
  PROD = "PROD",
  ADMIN = "ADMIN",
  STUDENT = "STUDENT",
}

export interface NavbarItem {
  label: string;
  href: string;
  icon: IImage;
  group: NavbarGroup;
}

export const router: NavbarItem[] = [
  { label: "Home", href: "/", icon: LOGO, group: NavbarGroup.ALL },
  { label: "Profile", href: "/profile", icon: PROFILE, group: NavbarGroup.PROD },
  { label: "Academic", href: "/academic", icon: ACADEMIC, group: NavbarGroup.STUDENT },
  { label: "Planner", href: "/planner", icon: PLANNER, group: NavbarGroup.STUDENT },
  { label: "Timer", href: "/timer", icon: TIMER, group: NavbarGroup.STUDENT },
  { label: "Admin Dashboard", href: "/admin", icon: ADMIN, group: NavbarGroup.ADMIN },
];
