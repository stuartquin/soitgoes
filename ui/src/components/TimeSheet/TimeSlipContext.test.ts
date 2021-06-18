import { parse } from "date-fns";

import * as models from "api/models";
import { getTotalsByProject } from "./TimeSlipContext";

describe("getTotalsByProject", () => {
  test("Week and month totals grouped by project", () => {
    const projects = [
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
    ] as models.Project[];
    const startDate = parse("2021-03-15", "yyyy-MM-dd", new Date());
    const timeSlips = [
      {
        project: 1,
        task: 1,
        user: 1,
        hours: 8,
        date: parse("2021-01-01", "yyyy-MM-dd", new Date()),
      },
      {
        project: 1,
        task: 1,
        user: 1,
        hours: 8,
        date: parse("2021-03-01", "yyyy-MM-dd", new Date()),
      },
      {
        project: 1,
        task: 1,
        user: 1,
        hours: 8,
        date: parse("2021-03-02", "yyyy-MM-dd", new Date()),
      },
      {
        project: 1,
        task: 1,
        user: 1,
        hours: 8,
        date: parse("2021-03-16", "yyyy-MM-dd", new Date()),
      },
      {
        project: 2,
        task: 1,
        user: 1,
        hours: 8,
        date: parse("2021-03-16", "yyyy-MM-dd", new Date()),
      },
    ] as models.TimeSlip[];

    expect(getTotalsByProject(startDate, projects, timeSlips)).toEqual({
      "1": {
        month: 24,
        week: 8,
      },
      "2": {
        month: 8,
        week: 8,
      },
      "3": {
        month: 0,
        week: 0,
      },
    });
  });
});

describe("getTimeSheet", () => {});
