import React from "react";
import { parse } from "date-fns";
import { BrowserRouter } from "react-router-dom";
import { render, fireEvent } from "@testing-library/react";

import * as models from "api/models";
import TimeSheetGrid from "./TimeSheetGrid";
import {
  TimeSlipContext,
  TimeSheetType,
  TimeSlipEntry,
} from "components/TimeSheet/TimeSlipContext";

const getTimeSheetEntry = (
  date: Date,
  task: models.Task,
  hours: number = 6
): TimeSlipEntry => {
  return {
    updated: false,
    date,
    timeSlip: {
      id: Math.floor(Math.random() * 500000),
      project: task.project,
      task: task.id,
      hours,
      date,
    },
  } as TimeSlipEntry;
};

test("Displays hour totals, updates", async () => {
  const user = {} as models.User;
  const startDate = new Date("2021-06-07");
  const projects = [
    {
      id: 1,
      name: "Test Project 1",
    },
  ] as models.Project[];

  const tasks = [
    {
      id: 1,
      project: 1,
      name: "Task 1",
    },
  ] as models.Task[];

  const entry1 = getTimeSheetEntry(
    parse("2021-06-09", "yyyy-MM-dd", new Date()),
    tasks[0]
  );
  const entry2 = getTimeSheetEntry(
    parse("2021-06-01", "yyyy-MM-dd", new Date()),
    tasks[0]
  );

  const timeSheet = {
    1: {
      "2021-06-08": entry1,
      "2021-06-01": entry2,
    },
  } as TimeSheetType;

  const updateHours = jest.fn();

  const { getByText, getByDisplayValue } = render(
    <BrowserRouter>
      <TimeSlipContext.Provider value={{ updateHours }}>
        <TimeSheetGrid
          timeSheet={timeSheet}
          user={user}
          startDate={startDate}
          projects={projects}
          tasks={tasks}
        />
      </TimeSlipContext.Provider>
    </BrowserRouter>
  );

  getByText("Test Project 1");
  getByText("6 hours");
  getByText("12 hours in June");

  const input = getByDisplayValue("6");
  await fireEvent.change(input, { target: { value: "8" } });
  expect(updateHours).toHaveBeenCalledWith(entry1, 8);
});

test("Navigate Previous/Next month", async () => {
  const startDate = new Date("2021-06-07");
  const projects = [
    {
      id: 1,
      name: "Test Project 1",
    },
  ] as models.Project[];

  const tasks = [
    {
      id: 1,
      project: 1,
      name: "Task 1",
    },
  ] as models.Task[];

  const timeSheet = {
    1: {},
  };

  const { getByText } = render(
    <BrowserRouter>
      <TimeSheetGrid
        timeSheet={timeSheet}
        user={{} as models.User}
        startDate={startDate}
        projects={projects}
        tasks={tasks}
      />
    </BrowserRouter>
  );

  const prev = getByText("Prev") as HTMLAnchorElement;
  expect(prev.href).toBe("http://localhost/time?date=2021-05-31");

  const next = getByText("Next") as HTMLAnchorElement;
  expect(next.href).toBe("http://localhost/time?date=2021-06-14");
});
