"use client";
import { use } from "react";
import ArtworkDetailPageComponent from "@/components/pages/artworks/ArtworkDetailPageComponent";

export default function ArtworkDetailPage({ params }) {
  const { slug } = use(params);
  return <ArtworkDetailPageComponent slug={slug} />;
}
