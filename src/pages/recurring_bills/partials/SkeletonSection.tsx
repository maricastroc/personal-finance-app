import { SkeletonTransactionCard } from "@/components/shared/SkeletonTransactionCard";

export const SkeletonSection = () => {
  return Array.from({ length: 9 }).map((_, index) => (
    <tr key={index} className="border-t">
      <td colSpan={5} className="px-4 py-2">
        <SkeletonTransactionCard />
      </td>
    </tr>
  ));
};
