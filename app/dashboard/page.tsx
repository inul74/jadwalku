import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import prisma from "../lib/db";
import { requireUser } from "../lib/hooks";
import { EmptyState } from "../components/EmptyState";

import { Button } from "@/components/ui/button";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      eventType: {
        select: {
          id: true,
          active: true,
          title: true,
          url: true,
          duration: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      userName: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function DashboardPage() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);

  return (
    <>
      <div className="flex items-center justify-between px-2">
        <div className="sm:grid gap-1 hidden">
          <h1 className="font-heading text-3xl md:text-4xl">Event Types</h1>
          <p className="text-lg text-muted-foreground">
            Create and manage your event types.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/new">Create New Event</Link>
        </Button>
      </div>

      {data.eventType.length === 0 ? (
        <EmptyState
          title="You have no Event Types"
          description="You can create your first event type by clicking the button below."
          buttonText="Add Event Type"
          href="/dashboard/new"
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <p>hey we have event types</p>
        </div>
      )}
    </>
  );
}
