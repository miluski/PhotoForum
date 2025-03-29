"use client";

import { useIsAuthorizedQuery } from "@/hooks/queries/is-authorized.query";
import { unauthorized } from "next/navigation";

export default function AccountSettingsPage() {
  const { data } = useIsAuthorizedQuery();

  if (data === false) {
    unauthorized();
  }

  return <div>Account Settings</div>;
}
