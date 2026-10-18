import { useCallback, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { BankAccount, TagType } from "apiv3";
import {
  QueryBuilderCondition,
  getColumnFields,
  getEmptyCondition,
  getQueryFromConditions,
} from "services/queryBuilter";

import TransactionQueryCondition from "./TransactionQueryCondition";

type Props = {
  tagTypes: TagType[];
  bankAccounts: BankAccount[];
};

export default function TransactionQuery({ tagTypes, bankAccounts }: Props) {
  const navigate = useNavigate();
  const [conditions, setConditions] = useState<QueryBuilderCondition[]>([
    getEmptyCondition(),
  ]);
  const columnFields = getColumnFields(bankAccounts);

  const handleChangeCondition = useCallback(
    (condition: QueryBuilderCondition) => {
      if (condition.operator === "REMOVE") {
        const filtered = conditions.filter((c) => c.id !== condition.id);
        setConditions(filtered.length ? filtered : [getEmptyCondition()]);
        return;
      }

      const conditionIndex = conditions.findIndex((c) => c.id === condition.id);
      const updatedConditions = [...conditions];

      if (!conditions[conditionIndex].operator && condition.operator) {
        updatedConditions.push(getEmptyCondition());
      }

      updatedConditions[conditionIndex] = condition;
      setConditions(updatedConditions);
    },
    [conditions]
  );

  const handleSearch = useCallback(() => {
    const query = getQueryFromConditions(conditions);
    navigate({
      to: "/finance",
      search: { query: query ? JSON.stringify(query) : undefined },
    });
  }, [conditions, navigate]);

  return (
    <div className="flex items-start">
      <div className="bg-white py-1 px-2 relative border border-grey-300 flex flex-wrap gap-1">
        {conditions.map((condition) => (
          <TransactionQueryCondition
            key={condition.id}
            condition={condition}
            onChange={handleChangeCondition}
            columnFields={columnFields}
            tagTypes={tagTypes}
          />
        ))}
      </div>
      <button
        className="border ml-3 border-gray-300 font-bold px-3 py-3 rounded bg-gray-50 mt-0.5"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
}
