"use client";

import { useIsAuthorizedQuery } from "@/hooks/queries/is-authorized.query";
import { unauthorized } from "next/navigation";

export default function AddPhotoPage() {
  const { data } = useIsAuthorizedQuery();

  if (data === false) {
    unauthorized();
  }

  return <div>Add photo page</div>;
}
