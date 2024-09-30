import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

import prisma from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import { nylas, nylasConfig } from "@/app/lib/nylas";

export async function GET(req: NextRequest) {
  console.log("Received callback from Nylas");
  const session = await requireUser();
  const url = new URL(req.url as string);
  const code = url.searchParams.get("code");

  if (!code) {
    return Response.json("Hey we did not get a code!", {
      status: 400,
    });
  }

  const codeExchangePayload = {
    clientSecret: nylasConfig.apiKey,
    clientId: nylasConfig.clientId as string,
    redirectUri: nylasConfig.redirectUri,
    code: code,
  };

  try {
    const response = await nylas.auth.exchangeCodeForToken(codeExchangePayload);
    const { grantId, email } = response;

    await prisma.user.update({
      where: {
        id: session.user?.id as string,
      },
      data: {
        grantId: grantId,
        grantEmail: email,
      },
    });

    console.log({ grantId });
  } catch (error) {
    console.error("Error exchanging code for token:", error);
  }

  redirect("/dashboard");
}
