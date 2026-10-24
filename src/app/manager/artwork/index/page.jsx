"use client";
import ArtworkIndexPageComponent from '@/components/pages/artworks/ArtworksIndexPageComponent';
import ArrowBackButton from '@/components/buttons/ArrowBackButton';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  return (
    <>
      <ArrowBackButton onBack={() => router.back()} />
      <ArtworkIndexPageComponent isManageMode={true} />
    </>
  );
}
