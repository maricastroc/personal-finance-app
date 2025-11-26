import { RecurringBillProps } from "./recurring-bills";

interface RecurringBillsWithDetails {
  bills: RecurringBillProps[];
  total: number;
}

export interface RecurringBillsResult {
  overdue: RecurringBillsWithDetails;
  upcoming: RecurringBillsWithDetails;
  dueSoon: RecurringBillsWithDetails;
  bills: RecurringBillProps[];
  monthlyTotal: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
