"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingLayer from "@/components/animations/LoadingLayer";
import AlertInfo from "@/components/alerts/AlertInfo";

/**
 * Generic edit-page shell.
 *
 * @param {Object}   params                – Next 13+ dynamic params (unwrapped)
 * @param {string}   apiPath               – API route pattern, e.g. "/api/image"
 * @param {string}   backRoutePrefix       – Manager list route, e.g. "/manager/image"
 * @param {React.FC} EditFormComponent     – Your schema-specific form
 * @param {string}   [notFoundMessage]     – Optional 404 text
 */
export default function ManagerEditShell({
  params,
  apiPath,
  backRoutePrefix,
  EditFormComponent,
  notFoundMessage = "Item not found.",
}) {
  const router = useRouter();
  const [item, setItem]   = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = React.use(params); // Next 13+ unwrapping

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiPath}/${id}`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setItem(data);
      } catch (err) {
        console.log(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id, apiPath]);

  /* ---------- UI states ---------- */
  if (isLoading)
    return <LoadingLayer isLoading />;

  if (error)
    return (
      <AlertInfo
        message={error}
        subMessage=""
        buttonText={`Back to ${backRoutePrefix.split("/").pop()}`}
        onBack={() => router.push(backRoutePrefix)}
      />
    );

  if (!item)
    return (
      <AlertInfo
        message={notFoundMessage}
        subMessage=""
        buttonText={`Back to ${backRoutePrefix.split("/").pop()}`}
        onBack={() => router.push(backRoutePrefix)}
      />
    );

  /* ---------- happy path ---------- */
  return <EditFormComponent item={item} id={id} />;
}