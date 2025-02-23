import { TagType } from "api";
import Input from "components/Form/Input";
import { useCallback, useMemo, useState } from "react";
import {
  getActiveStatement,
  getActiveSuggestions,
  getWordAtCaret,
  replaceWordAtCaret,
} from "services/search";

type Props = {
  tagTypes: TagType[];
};

export default function TransactionSearch({ tagTypes }: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const tagTypesByKeyword: Record<string, TagType[]> = useMemo(() => {
    const grouped: Record<string, TagType[]> = {};
    tagTypes.forEach((t) => {
      const keyword = t.tagType.toLowerCase();
      grouped[keyword] = (grouped[keyword] || []).concat({
        ...t,
        displayValue: t.displayValue.toLowerCase(),
      });
    });
    return grouped;
  }, [tagTypes]);

  const handleKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value;
      const caret = event.currentTarget.selectionEnd || 0;
      if (event.key === "Enter") {
        event.preventDefault();
        const [updatedValue, caretPosition] = replaceWordAtCaret(
          value,
          caret,
          suggestions[suggestionIndex]
        );

        event.currentTarget.value = updatedValue;
        event.currentTarget.setSelectionRange(caretPosition, caretPosition);

        return false;
      }

      const activeSuggestions = getActiveSuggestions(
        value,
        caret,
        tagTypesByKeyword
      );
      if (activeSuggestions.length > 0) {
        setSuggestions(activeSuggestions);
      } else {
        setSuggestionIndex(0);
        setSuggestions([]);
      }
    },
    [suggestions, suggestionIndex, tagTypesByKeyword]
  );
  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSuggestionIndex((suggestionIndex + 1) % suggestions.length);
        return false;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSuggestionIndex((suggestionIndex - 1) % suggestions.length);

        return false;
      }
    },
    [suggestionIndex, suggestions]
  );

  return (
    <div className="bg-white py-6 px-6 relative">
      <Input
        className="w-full font-mono"
        type="text"
        onKeyDown={handleKeyPress}
        onKeyUp={handleKeyUp}
      />
      <div className="absolute w-80 bg-white shadow space-y-2 z-10">
        {suggestions.map((suggestion, index) => (
          <div
            key={suggestion}
            className={`px-3 ${suggestionIndex === index ? "bg-gray-50" : ""}`}
          >
            {suggestion}
          </div>
        ))}
      </div>
    </div>
  );
}
