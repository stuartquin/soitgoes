import { TagType } from "api";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import {
  ColumnFields,
  QueryBuilderCondition,
  TAG_OPERATORS,
} from "services/queryBuilter";

type Props = {
  tagTypes: TagType[];
  columnFields: ColumnFields[];
  condition: QueryBuilderCondition;
  onChange: (condition: QueryBuilderCondition) => void;
};

export default function TransactionQueryCondition({
  tagTypes,
  columnFields,
  condition,
  onChange,
}: Props) {
  const [comparatorOptions, setComparatorOptions] = useState<string[]>([]);
  const [valueOptions, setValueOptions] = useState<
    { label: string; value: string | number }[]
  >([]);
  const [valueFieldType, setValueFieldType] = useState<string>("");

  const tagTypesByKeyword: Record<string, TagType[]> = useMemo(() => {
    const grouped: Record<string, TagType[]> = {};
    tagTypes.forEach((t) => {
      const keyword = t.tagType.toLowerCase();
      grouped[keyword] = (grouped[keyword] || []).concat({
        ...t,
      });
    });
    return grouped;
  }, [tagTypes]);

  const handleChangeKeyword = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.currentTarget.value;
      const columnField = columnFields.find((field) => field.value === value);

      if (columnField) {
        setComparatorOptions(columnField.comparators);
        setValueFieldType(columnField.fieldType);
        setValueOptions(columnField.options || []);
        onChange({
          ...condition,
          field: value,
          isTag: false,
          comparator: columnField.comparators[0],
          value: columnField.options?.[0].value || "",
        });
      } else {
        const tagType = tagTypesByKeyword[value];
        setComparatorOptions(TAG_OPERATORS);
        setValueFieldType("select");
        const options = tagType.map((tagType) => ({
          label: tagType.displayValue,
          value: tagType.value,
        }));
        setValueOptions(options);
        onChange({
          ...condition,
          field: value,
          isTag: true,
          comparator: TAG_OPERATORS[0],
          value: options?.[0].value || "",
        });
      }
    },
    [condition, columnFields, onChange]
  );

  const handleChangeComparator = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.currentTarget.value;
      onChange({ ...condition, comparator: value });
    },
    [condition, onChange]
  );
  const handleChangeOperator = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.currentTarget.value;
      onChange({ ...condition, operator: value as "AND" | "OR" });
    },
    [condition, onChange]
  );

  const handleChangeValue = useCallback(
    (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      const value = event.currentTarget.value;
      onChange({ ...condition, value });
    },
    [condition, onChange]
  );

  return (
    <div className="flex hover:bg-gray-50">
      <select
        className="p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-transparent"
        onChange={handleChangeKeyword}
        value={condition.field}
      >
        <option value="" disabled>
          Filter by
        </option>
        <optgroup label="Columns">
          {columnFields.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </optgroup>
        <optgroup label="Tags">
          {Object.keys(tagTypesByKeyword).map((keyword) => (
            <option key={keyword} className="capitalize">
              {keyword}
            </option>
          ))}
        </optgroup>
      </select>

      {comparatorOptions.length > 0 && (
        <select
          className="p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-transparent w-24 max-w-24 text-center"
          onChange={handleChangeComparator}
        >
          {comparatorOptions.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      )}

      {valueFieldType === "select" && (
        <select
          className="p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-transparent w-40 max-w-40 truncate"
          onChange={handleChangeValue}
        >
          {valueOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {["text", "number"].includes(valueFieldType) && (
        <input
          className="p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-transparent w-40 max-w-40 "
          type={valueFieldType}
          placeholder="value"
          onChange={handleChangeValue}
        />
      )}

      {comparatorOptions.length > 0 && (
        <select
          className="p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-transparent text-center border-gray-200 border font-bold text-gray-800 ml-2"
          onChange={handleChangeOperator}
          value={condition.operator}
        >
          <option value="" disabled>
            Add Condition
          </option>
          <option value="AND">And</option>
          <option value="OR">Or</option>
          <optgroup>
            <option value="REMOVE">Remove</option>
          </optgroup>
        </select>
      )}
    </div>
  );
}
