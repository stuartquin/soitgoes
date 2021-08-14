import React, { useState, useCallback } from "react";
import { range } from "lodash";
import {
  format,
  addDays,
  differenceInWeeks,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

import Input from "components/Form/Input";
import Label from "components/Form/Label";
import Button from "components/Button";
import Alert from "components/Alert";
import * as models from "api/models";
import { formatCurrency } from "currency";

interface Props {
  project: models.Project;
  onAddTasks: (tasks: models.Task[]) => void;
}

const getStartDate = (): Date => {
  // TODO assuming we don't invoice in first week of a month
  return startOfMonth(addDays(new Date(), -7));
};

const getEndDate = (): Date => {
  // TODO assuming we don't invoice in first week of a month
  return endOfMonth(addDays(new Date(), -7));
};

function InvoiceWeeklyTaskSettings({ project, onAddTasks }: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const [startDate, setStartDate] = useState<Date>(getStartDate());
  const [endDate, setEndDate] = useState<Date>(getEndDate());

  const updateStartDate = useCallback((event) => {
    setStartDate(event.target.valueAsDate || new Date());
  }, []);

  const updateEndDate = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEndDate(event.target.valueAsDate || new Date());
    },
    []
  );

  const weeks = differenceInWeeks(endDate, startDate);
  const tasks = range(0, weeks).map((week) => {
    const date = format(
      endOfWeek(addDays(startDate, week * 7), { weekStartsOn: 1 }),
      "yyyy-MM-dd"
    );
    return models.TaskFromJSON({
      name: `Week ending ${date}`,
      billing_type: models.TaskBillingTypeEnum.Fixed,
      cost: project.weeklyRate,
      project: project.id,
      state: models.TaskStateEnum.Done,
    });
  });

  const addToInvoice = () => {
    setIsVisible(false);
    onAddTasks(tasks);
  };

  return isVisible ? (
    <Alert
      variant="primary"
      className="my-4"
      onDismiss={() => setIsVisible(false)}
    >
      Generate <strong>{weeks}</strong> weekly invoice items at{" "}
      <strong>{formatCurrency(project.weeklyRate || 0)}</strong> per week.
      <div className="grid grid-cols-2 gap-1 my-4">
        <div>
          <Label htmlFor="startDate" className="text-blue-400">
            Start Date
          </Label>
          <Input
            type="date"
            name="startDate"
            id="startDate"
            value={format(startDate, "yyyy-MM-dd")}
            onChange={updateStartDate}
            className="flex-1 block w-full sm:text-sm border border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <Label htmlFor="endDate" className="text-blue-400">
            End Date
          </Label>
          <Input
            type="date"
            name="endDate"
            id="endDate"
            value={format(endDate, "yyyy-MM-dd")}
            onChange={updateEndDate}
            className="flex-1 block w-full sm:text-sm border border-gray-300 rounded p-2"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="primary" onClick={addToInvoice} size="small">
          Add To Invoice
        </Button>
      </div>
    </Alert>
  ) : null;
}

export default InvoiceWeeklyTaskSettings;
