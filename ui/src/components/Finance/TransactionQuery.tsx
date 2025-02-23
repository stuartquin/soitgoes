import { BankAccount, TagType } from "api";
import { useCallback, useState } from "react";
import {
  QueryBuilderCondition,
  getColumnFields,
  getEmptyCondition,
  getQueryFromConditions,
} from "services/queryBuilter";
import TransactionQueryCondition from "./TransactionQueryCondition";
import { FetcherWithComponents } from "react-router";

type Props = {
  tagTypes: TagType[];
  bankAccounts: BankAccount[];
  fetcher: FetcherWithComponents<any>;
};

export default function TransactionQuery({
  tagTypes,
  bankAccounts,
  fetcher,
}: Props) {
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
    fetcher.submit(
      `?query=${JSON.stringify(getQueryFromConditions(conditions))}`,
      {
        method: "get",
      }
    );
  }, [conditions]);

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
