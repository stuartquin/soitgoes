import { TagType } from "apiv3";

export const getGroupedTagType = (tagTypes: TagType[]) => {
  const grouped: Record<string, TagType> = {};
  tagTypes.forEach((tagType) => {
    grouped[tagType.tag_type] = {
      ...tagType,
      count: grouped[tagType.tag_type]
        ? grouped[tagType.tag_type].count + tagType.count
        : tagType.count,
    };
  });

  return Object.values(grouped);
};
