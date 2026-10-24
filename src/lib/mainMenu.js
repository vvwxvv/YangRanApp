import { getMenu, toDots } from "@/lib/menu";

export const getMainMenuDots = (isCn, source) => toDots(getMenu("mainMenu", isCn, source));