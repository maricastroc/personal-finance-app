import { RecurringBillProps } from "@/types/recurringBills";
import { formatToDollar } from "@/utils/formatToDollar";
import { RecurringBillCard } from "./RecurringBillCard";
import { getOrdinalSuffix } from "@/utils/getOrdinalSuffix";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import iconBillPaid from "/public/assets/images/icon-bill-paid.svg";
import iconBillDue from "/public/assets/images/icon-bill-due.svg";
import Image from "next/image";
import { SkeletonSection } from "./SkeletonSection";

export const RecurringBillsTable = ({
  recurringBills,
  isValidating,
}: {
  recurringBills: RecurringBillProps[] | undefined;
  isValidating: boolean;
}) => (
  <table className="min-w-full table-fixed">
    <thead>
      <tr>
        <th className="px-4 py-2 text-xs text-grey-500 text-left w-2/5">
          Bill Title
        </th>
        <th className="px-4 py-2 text-xs text-grey-500 text-left w-1/5">
          Due Date
        </th>
        <th className="px-4 py-2 text-xs text-grey-500 text-right w-1/5">
          Amount
        </th>
      </tr>
    </thead>

    <tbody>
      {isValidating ? (
        <SkeletonSection />
      ) : recurringBills && recurringBills.length > 0 ? (
        recurringBills.map((bill) => (
          <tr key={bill.id} className="border-t">
            <td className="px-4 py-2 text-left">
              <RecurringBillCard
                name={bill.contactName}
                avatarUrl={bill.contactAvatar}
              />
            </td>

            <td className="text-xs text-grey-500 px-4 py-2 text-left">
              <div className="flex items-center gap-2">
                {`${capitalizeFirstLetter(
                  bill.recurrenceFrequency
                )} - ${getOrdinalSuffix(bill.recurrenceDay || "")}`}

                {bill.status === "paid" && (
                  <Image src={iconBillPaid} alt="" width={12} />
                )}

                {bill.status === "due soon" && (
                  <Image src={iconBillDue} alt="" width={12} />
                )}
              </div>
            </td>

            <td className="text-sm text-grey-500 px-4 py-2 text-right">
              <span
                className={`font-bold ${
                  bill.status === "due soon"
                    ? "text-secondary-red"
                    : "text-grey-900"
                }`}
              >
                {formatToDollar(bill.amount)}
              </span>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={3} className="px-4 py-2">
            <span className="text-secondary-red text-sm font-bold">
              No transactions found.
            </span>
          </td>
        </tr>
      )}
    </tbody>
  </table>
);
