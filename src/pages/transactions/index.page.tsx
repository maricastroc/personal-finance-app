import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { TransactionProps } from "@/types/transaction";
import { CategoryProps } from "@/types/category";
import { useAppContext } from "@/contexts/AppContext";
import { EmptyContent } from "@/components/shared/EmptyContent";
import { SkeletonTransactionCard } from "@/components/shared/SkeletonTransactionCard";
import Layout from "@/components/layouts/layout.page";
import { LoadingPage } from "@/components/shared/LoadingPage";
import { PaginationSection } from "@/components/shared/PaginationSection/PaginationSection";
import { SearchSection } from "./partials/SearchSection";
import { TransactionTable } from "./partials/TransactionsTable";
import { TransferFormModal } from "./partials/TransferFormModal";
import { TransactionCard } from "./partials/TransactionCard";
import useRequest from "@/utils/useRequest";
import { formatToSnakeCase } from "@/utils/formatToSnakeCase";
import { formatToDollar } from "@/utils/formatToDollar";
import { useLoadingOnRouteChange } from "@/utils/useLoadingOnRouteChange";
import { calculateTotalPages } from "@/utils/calculateTotalPages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import * as Dialog from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { useDebounce } from "@/utils/useDebounce";
import { PageTitle } from "@/components/shared/PageTitle";
import { PrimaryButton } from "@/components/core/PrimaryButton";

export default function Transactions() {
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSortBy, setSelectedSortBy] = useState("latest");
  const [maxVisibleButtons, setMaxVisibleButtons] = useState(3);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const router = useRouter();
  const { category } = router.query;

  const { isSidebarOpen } = useAppContext();
  const isRouteLoading = useLoadingOnRouteChange();

  useDebounce(
    () => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    },
    500,
    [search]
  );

  const { data, isValidating, mutate } = useRequest<{
    transactions: TransactionProps[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(
    {
      url: `/transactions?page=${currentPage}&limit=10&filterByName=${selectedCategory.toLowerCase()}&sortBy=${formatToSnakeCase(
        selectedSortBy
      )}&search=${debouncedSearch}`,
      method: "GET",
    },
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
      dedupingInterval: 20000,
      focusThrottleInterval: 30000,
    }
  );

  const { data: categories } = useRequest<CategoryProps[]>(
    { url: "/categories", method: "GET" },
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
      dedupingInterval: 20000,
      focusThrottleInterval: 30000,
    }
  );

  const transactions = data?.transactions || [];

  const pagination = data?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  const totalPages = calculateTotalPages(pagination.total, pagination.limit);

  useEffect(() => {
    const updateMax = () => {
      if (window.innerWidth >= 1024) setMaxVisibleButtons(6);
      else if (window.innerWidth >= 768) setMaxVisibleButtons(4);
      else setMaxVisibleButtons(3);
    };

    updateMax();
    window.addEventListener("resize", updateMax);
    return () => window.removeEventListener("resize", updateMax);
  }, []);

  const handleSetCategory = useCallback((value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  }, []);

  const handleSetSortBy = useCallback((value: string) => {
    setSelectedSortBy(value);
    setCurrentPage(1);
  }, []);

  if (isRouteLoading) return <LoadingPage />;

  return (
    <>
      <NextSeo title="Transactions | Finance App" />

      <Layout>
        <main
          className={`w-full px-4 py-5 flex-grow md:p-10 lg:pl-0 pb-20 md:pb-32 lg:pb-8 ${
            isSidebarOpen ? "lg:pr-10" : "lg:pr-20"
          }`}
          aria-labelledby="transactions-title"
        >
          <div className="flex items-center justify-between w-full">
            <PageTitle title="Transactions" />

            <Dialog.Root
              open={isTransferModalOpen}
              onOpenChange={setIsTransferModalOpen}
            >
              <Dialog.Trigger asChild>
                <PrimaryButton
                  aria-haspopup="dialog"
                  aria-expanded={isTransferModalOpen}
                  aria-controls="transfer-form-modal"
                  className="mt-0 max-w-[5rem] sm:max-w-[8rem] text-sm"
                >
                  <FontAwesomeIcon icon={faPlus} className="hidden sm:block" />
                  Transfer
                </PrimaryButton>
              </Dialog.Trigger>

              {categories && (
                <TransferFormModal
                  id="transfer-form-modal"
                  categories={categories}
                  onSubmitForm={async (): Promise<void> => {
                    await mutate();
                  }}
                  onClose={() => setIsTransferModalOpen(false)}
                />
              )}
            </Dialog.Root>
          </div>

          <section className="mt-8 flex flex-col bg-white px-5 py-6 rounded-md md:p-10">
            <SearchSection
              categories={categories}
              category={category as string}
              search={search}
              handleSetSortBy={handleSetSortBy}
              handleSetSearch={setSearch}
              handleSetCategory={handleSetCategory}
            />

            <TransactionTable
              transactions={transactions}
              isValidating={isValidating}
            />

            <div
              className="flex flex-col md:hidden"
              aria-label="Transaction list"
            >
              {isValidating ? (
                Array.from({ length: 9 }).map((_, i) => (
                  <SkeletonTransactionCard key={i} />
                ))
              ) : transactions.length ? (
                transactions.map((t, index) => (
                  <TransactionCard
                    key={index}
                    name={t.contactName}
                    balance={t.balance}
                    avatarUrl={t.contactAvatar}
                    date={format(t.date, "MMM dd, yyyy")}
                    value={formatToDollar(t.amount || 0)}
                    category={t.category?.name}
                  />
                ))
              ) : (
                <EmptyContent content="No transactions available" />
              )}
            </div>

            <div className="flex items-center justify-between gap-2 mt-6">
              <PaginationSection
                currentPage={currentPage}
                maxVisibleButtons={maxVisibleButtons}
                totalPages={totalPages}
                handleSetCurrentPage={setCurrentPage}
              />
            </div>
          </section>
        </main>
      </Layout>
    </>
  );
}
