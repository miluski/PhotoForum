import { useIsAuthorizedQuery } from "@/hooks/queries/is-authorized.query";
import { unauthorized } from "next/navigation";

export default function DashboardPage() {
  const { data } = useIsAuthorizedQuery();

  if (data === false) {
    unauthorized();
  }

  return <div>Dashboard page</div>;
}
