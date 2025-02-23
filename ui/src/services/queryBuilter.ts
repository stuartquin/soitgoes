import { BankAccount } from "api";

export const NUMERIC_OPERATORS = ["=", "!=", ">", ">=", "<", "<="];
export const TEXT_OPERATORS = ["contains", "="];
export const TAG_OPERATORS = ["=", "exists"];

export type QueryBuilderCondition = {
  id: number;
  field: string;
  comparator: string;
  value: string | number;
  isTag?: boolean;
  operator?: "AND" | "OR" | "REMOVE" | "";
};

export type ColumnFields = {
  value: string;
  label: string;
  comparators: string[];
  fieldType: string;
  options: { label: string; value: string | number }[] | undefined;
};

export const getEmptyCondition = () => {
  return {
    id: Math.random() * 999999999,
    field: "",
    comparator: "",
    operator: "",
    value: "",
  } as QueryBuilderCondition;
};

export const getColumnFields = (bankAccounts: BankAccount[]) => {
  return [
    {
      value: "column_bank_account",
      label: "Account",
      comparators: ["="],
      fieldType: "select",
      options: bankAccounts.map((bankAccount) => ({
        value: bankAccount.id,
        label: bankAccount.name,
      })),
    },
    {
      value: "column_amount",
      label: "Amount (£)",
      comparators: NUMERIC_OPERATORS,
      fieldType: "number",
    },
    {
      value: "column_date",
      label: "Date",
      comparators: NUMERIC_OPERATORS,
      fieldType: "text",
    },
    {
      value: "column_description",
      label: "Description",
      comparators: TEXT_OPERATORS,
      fieldType: "text",
    },
  ] as ColumnFields[];
};

export const getQueryCondition = (condition: QueryBuilderCondition) => {
  if (condition.isTag) {
    return {
      tag_type: condition.field,
      comparator: condition.comparator,
      value: condition.value,
    };
  } else {
    return {
      field: condition.field.replace(/column_/, ""),
      comparator: condition.comparator,
      value:
        condition.field === "column_amount" && condition.value !== undefined
          ? parseInt(`${condition.value}`) * 100
          : condition.value,
    };
  }
};

export const getQueryFromConditions = (conditions: QueryBuilderCondition[]) => {
  if (!conditions.length || !conditions[0].field) {
    return null;
  }

  let operator = conditions[0].operator || "AND";
  let queries: any[] = [];
  let resultQuery = {
    [operator]: queries,
  };
  conditions.forEach((condition) => {
    if (!condition.operator || condition.operator === operator) {
      queries.push(getQueryCondition(condition));
    } else {
      const newQueries: object[] = [getQueryCondition(condition)];
      queries.push({ [condition.operator]: newQueries });
      queries = newQueries;
      operator = condition.operator;
    }
  });

  return resultQuery;
};
