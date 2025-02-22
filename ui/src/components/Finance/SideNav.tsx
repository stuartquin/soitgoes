import {
  ListBankAccounts200Response,
  ListBankTransactions200Response,
  ListTagTypes200Response,
  TagType,
} from "api";
import React, { useMemo } from "react";
import { NavLink } from "react-router";
import { getGroupedTagType } from "services/finance";

type Props = {
  bankDataPromise: Promise<{
    tagTypeResponse: ListTagTypes200Response;
    transactionResponse: ListBankTransactions200Response;
    bankAccountResponse: ListBankAccounts200Response;
  }>;
};

export default function SideNav({ bankDataPromise }: Props) {
  const { tagTypeResponse, bankAccountResponse } = React.use(bankDataPromise);
  const tagTypes = useMemo(() => {
    return getGroupedTagType(tagTypeResponse.results);
  }, [tagTypeResponse.results]);

  return (
    <div className="h-full bg-gray-50 border-r border-r-gray-200 w-64 space-y-6 py-6">
      <div className="px-6">
        <div className="font-semibold mb-2">Accounts</div>
        <div className="space-y-1">
          {bankAccountResponse.results.map((bankAccount) => (
            <NavLink to="" className="block capitalize text-sm hover:underline">
              {bankAccount.name}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="px-6">
        <div className="font-semibold mb-2">Tags</div>
        <div className="space-y-1">
          {tagTypes.map((tagType) => (
            <NavLink to="" className="block capitalize text-sm hover:underline">
              {tagType.tagType}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
