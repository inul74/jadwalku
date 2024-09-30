import { redirect } from "next/navigation";

import { nylas, nylasConfig } from "@/app/lib/nylas";

export async function GET() {
  const authUrl = nylas.auth.urlForOAuth2({
    clientId: nylasConfig.clientId as string,
    redirectUri: nylasConfig.redirectUri,
  });

  return redirect(authUrl);
}
