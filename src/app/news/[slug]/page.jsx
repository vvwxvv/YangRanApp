"use client";
import { use } from "react";
import ExhibitionDetailPageComponent from "@/components/pages/exhibition/ExhibitionDetailPageComponent";

export default function ExhibitionSlugPage({ params }) {
  const { slug } = use(params);
  return <ExhibitionDetailPageComponent slug={slug} />;
}
