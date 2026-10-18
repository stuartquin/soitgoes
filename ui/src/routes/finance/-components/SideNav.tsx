import { useMemo } from "react";
import { Link } from "@tanstack/react-router";

import { BankAccount, TagType } from "apiv3";
import { getGroupedTagType } from "services/finance";

type Props = {
  tagTypes: TagType[];
  bankAccounts: BankAccount[];
};

export default function SideNav({ tagTypes, bankAccounts }: Props) {
  const groupedTagTypes = useMemo(() => {
    return getGroupedTagType(tagTypes);
  }, [tagTypes]);

  return (
    <div className="h-full bg-gray-50 border-r border-r-gray-200 w-64 space-y-6 py-6">
      <div className="px-6">
        <div className="font-semibold mb-2">Accounts</div>
        <div className="space-y-1">
          {bankAccounts.map((bankAccount) => (
            <Link
              key={bankAccount.id}
              to="/finance"
              search={{}}
              className="block capitalize text-sm hover:underline"
            >
              {bankAccount.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="px-6">
        <div className="font-semibold mb-2">Tags</div>
        <div className="space-y-1">
          {groupedTagTypes.map((tagType) => (
            <Link
              key={tagType.tag_type}
              to="/finance"
              search={{}}
              className="block capitalize text-sm hover:underline"
            >
              {tagType.tag_type}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
