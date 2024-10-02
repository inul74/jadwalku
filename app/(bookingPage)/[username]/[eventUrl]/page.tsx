import React from "react";
import Image from "next/image";

import { notFound } from "next/navigation";
import { CalendarX2, Clock, LucideVideo } from "lucide-react";

import prisma from "@/app/lib/db";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { RenderCalendar } from "@/app/components/bookingForm/RenderCalendar";

async function getData(eventUrl: string, userName: string) {
  const data = await prisma.eventType.findFirst({
    where: {
      url: eventUrl,
      user: {
        userName: userName,
      },
      active: true,
    },
    select: {
      id: true,
      description: true,
      title: true,
      duration: true,
      videoCallSoftware: true,

      user: {
        select: {
          image: true,
          name: true,
          availability: {
            select: {
              day: true,
              isActive: true,
            },
          },
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function BookingFormRoute({
  params,
  searchParams,
}: {
  params: { userName: string; eventUrl: string };
  searchParams: { date?: string; time?: string };
}) {
  const data = await getData(params.eventUrl, params.userName);

  const selectedDate = searchParams.date
    ? new Date(searchParams.date)
    : new Date();

  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(selectedDate);

  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card className="max-w-[750px]">
        <CardContent className="p-3 grid md:grid-cols-[1fr,auto,1fr] gap-3">
          <div>
            <Image
              src={data.user?.image as string}
              alt={`${data.user?.name}'s profile picture`}
              className="size-8 rounded-full"
              width={32}
              height={32}
              priority
            />
            <p className="text-sm font-medium text-muted-foreground mt-1">
              {data.user?.name}
            </p>
            <h1 className="text-xl font-semibold mt-2">{data.title}</h1>
            <p className="text-sm font-medium text-muted-foreground">
              {data.description}
            </p>

            <div className="mt-5 grid gap-y-3">
              <p className="flex items-center">
                <CalendarX2 className="size-4 mr-2 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  {formattedDate}
                </span>
              </p>
              <p className="flex items-center">
                <Clock className="size-4 mr-2 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  {data.duration} Menit
                </span>
              </p>
              <p className="flex items-center">
                <LucideVideo className="size-4 mr-2 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  {data.videoCallSoftware}
                </span>
              </p>
            </div>
          </div>
          <Separator
            orientation="vertical"
            className="hidden md:block h-full w-[1px]"
          />

          <div className="my-4 md:my-0">
            <RenderCalendar availability={data.user?.availability as any} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
