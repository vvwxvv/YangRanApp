"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArtistContactEditForm from "@/components/forms/ArtistContactEditForm";
import LoadingLayer from "@/components/animations/LoadingLayer";
import AlertInfo from '@/components/alerts/AlertInfo';

export default function EditArtistContactPage({ params }) {
  const router = useRouter();
  const [ArtistContact, setArtistContact] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id; // Extract the `id` from the unwrapped params object

  // 从 API 获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/artist-contact/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setArtistContact(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]); // 当 id 变化时重新获取

  // 加载状态
  if (isLoading) {
    return <LoadingLayer isLoading={isLoading} />;
  }

  // 错误状态
  if (error) {
    return (
      <AlertInfo
        message={error}
        subMessage=""
        buttonText="Back to Artist Contacts"
        onBack={() => router.push("/manager/artist-contact")}
      />
    );
  }

  // 未找到数据
  if (!ArtistContact) {
    return (
      <AlertInfo
        message="Artist Contact not found."
        subMessage=""
        buttonText="Back to Artist Contacts"
        onBack={() => router.push("/manager/artist-contact")}
      />
    );
  }

  // 渲染编辑表单
  return (
    <div style={{ padding: '40px' }}>
      <ArtistContactEditForm item={ArtistContact} id={id} />
    </div>
  );
}