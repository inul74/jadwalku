"use client";

import { useCalendarState } from "react-stately";
import { createCalendar } from "@internationalized/date";
import { useCalendar, useLocale } from "react-aria";
import { CalendarProps, DateValue } from "@react-types/calendar";

import { CalendarGrid } from "./CalendarGrid";
import { CalendarHeader } from "./CalendarHeader";

export function Calendar(props: CalendarProps<DateValue>) {
  const { locale } = useLocale();

  let state = useCalendarState({
    ...props,
    visibleDuration: { months: 1 },
    locale,
    createCalendar,
  });

  let { calendarProps, prevButtonProps, nextButtonProps } = useCalendar(
    props,
    state
  );

  return (
    <div {...calendarProps} className="inline-block ">
      <CalendarHeader
        state={state}
        calendarProps={calendarProps}
        prevButtonProps={prevButtonProps}
        nextButtonProps={nextButtonProps}
      />
      <div className="flex gap-8">
        <CalendarGrid
          state={state}
          isDateUnavailable={props.isDateUnavailable}
        />
      </div>
    </div>
  );
}
