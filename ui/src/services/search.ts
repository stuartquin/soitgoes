import { TagType } from "api";

export const getWordAtCaret = (value: string, caret: number) => {
  return value.slice(0, caret).split(" ").slice(-1)[0];
};

const isOperator = (value: string) => {
  return ["=", "!=", "IS", "IN", ">", ">=", "<", "<="].includes(value);
};

export const getActiveStatement = (value: string, caret: number) => {
  const words = value
    .slice(0, caret)
    .trim()
    .replace(/(.)(>=|<=|!=|=|<|>)(.)/gm, "$1 $2 $3")
    .toLowerCase()
    .split(" ")
    .filter((w) => w)
    .slice(-3)
    .map((w) => w.replace(/"/g, ""));

  const end = words.slice(-1)[0];
  const middle = words.slice(-2)[0];

  if (words.length > 1 && isOperator(end)) {
    return [words.slice(-2)[0], end, null];
  }

  if (words.length > 2 && isOperator(middle)) {
    return words;
  }

  return [end, null, null];
};

export const replaceWordAtCaret = (
  value: string,
  caret: number,
  replacement: string
): [string, number] => {
  if (!replacement) {
    return [value, caret];
  }

  const start = value
    .slice(0, caret)
    .trim()
    .replace(/(.)(>=|<=|!=|=|<|>)(.)/gm, "$1 $2 $3")
    .split(" ")
    .filter((w) => w)
    .join(" ");

  const end = value.slice(caret).trim();
  const lastSpace = start.lastIndexOf(" ");
  const replaceStart = start.slice(0, lastSpace > -1 ? lastSpace : 0);

  const replacementValue = isOperator(replaceStart.split(" ").slice(-1)[0])
    ? `"${replacement}"`
    : replacement;

  const updatedStart = [replaceStart, replacementValue]
    .filter((w) => w)
    .join(" ");

  return [`${updatedStart} ${end}`, updatedStart.length];
};

const KEYWORDS = ["amount", "account"];

export const getActiveSuggestions = (
  value: string,
  caret: number,
  tagTypesByKeyword: Record<string, TagType[]>
) => {
  const [keyword, operator, val] = getActiveStatement(value, caret);

  if (keyword && val && tagTypesByKeyword[keyword]) {
    const loweredValue = val.toLowerCase();
    return tagTypesByKeyword[keyword]
      .filter((tagType) => tagType.displayValue.startsWith(loweredValue))
      .map((tagType) => tagType.displayValue);
  }

  if (operator) {
    return [];
  }

  if (keyword) {
    const loweredKeyword = keyword.toLowerCase();
    return KEYWORDS.concat(Object.keys(tagTypesByKeyword)).filter((keyword) =>
      keyword.toLowerCase().startsWith(loweredKeyword)
    );
  }

  return [];
};
