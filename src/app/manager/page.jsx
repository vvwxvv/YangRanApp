import { redirect } from "next/navigation";

/**
 * The manager index used to be a hand-built list of every collection with
 * record counts. It duplicated the navigation and looked cramped, so it is
 * gone: /manager simply lands on the first content section.
 *
 * Navigation now lives in the fixed left rail (ManagerSideNav) and, for quick
 * jumping, in the footer of every manager page.
 */
export default function ManagerIndexPage() {
  redirect("/manager/artwork");
}
