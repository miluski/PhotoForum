"use client";

import { useParams } from "next/navigation";

export default function PhotoPage() {
  const { photoId } = useParams();

  return <div>photo {photoId}</div>;
}
