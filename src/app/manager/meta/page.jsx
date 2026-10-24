"use client";

import React from "react";
import SiteMetaPageComponent from "@/components/pages/manager/meta/SiteMetaPageComponent";
import ManagerUserGuide from "@/components/docs/ManagerUserGuide";

export default function MetaManagerPage() {
  return (
    <>
      <SiteMetaPageComponent />
      <ManagerUserGuide />
    </>
  );
}
