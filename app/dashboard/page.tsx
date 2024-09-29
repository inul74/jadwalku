import { redirect } from "next/navigation";

import { requireUser } from "../lib/hooks";

export default async function DashboardPage() {
  const session = await requireUser();

  if (!session?.user) {
    return redirect("/");
  }

  return (
    <div>
      <h1>Hello from the dashboard</h1>
    </div>
  );
}
