import { TagType } from "api";

export const getGroupedTagType = (tagTypes: TagType[]) => {
  const grouped: Record<string, TagType> = {};
  tagTypes.forEach((tagType) => {
    grouped[tagType.tagType] = {
      ...tagType,
      count: grouped[tagType.tagType]
        ? grouped[tagType.tagType].count + tagType.count
        : tagType.count,
    };
  });

  return Object.values(grouped);
};
