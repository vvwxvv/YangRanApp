import { redirect } from "next/navigation";

// The archive moved to /archive — keep the old URL working.
export default function LegacyArtworkArchive() {
  redirect("/archive");
}
