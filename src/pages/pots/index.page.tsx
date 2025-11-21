import { useState } from "react";
import { NextSeo } from "next-seo";
import { useAppContext } from "@/contexts/AppContext";
import Layout from "@/components/layouts/layout.page";
import { EmptyContent } from "@/components/shared/EmptyContent";
import { LoadingPage } from "@/components/shared/LoadingPage";
import { PotFormModal } from "./partials/PotFormModal";
import { SkeletonPotCard } from "./partials/SkeletonPotCard";
import { PageHeader } from "./partials/PageHeader";
import { PotCard } from "./partials/PotCard";
import { AllPotsProps } from "../home/index.page";
import useRequest from "@/utils/useRequest";
import { useLoadingOnRouteChange } from "@/utils/useLoadingOnRouteChange";

export default function Pots() {
  const { isSidebarOpen } = useAppContext();

  const isRouteLoading = useLoadingOnRouteChange();

  const [isPotModalOpen, setIsPotModalOpen] = useState(false);

  const {
    data: pots,
    mutate,
    isValidating,
  } = useRequest<AllPotsProps>(
    {
      url: "/pots",
      method: "GET",
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
      dedupingInterval: 20000,
      focusThrottleInterval: 30000,
      keepPreviousData: true,
    }
  );

  if (isRouteLoading) return <LoadingPage />;

  return (
    <>
      <NextSeo
        title="Pots | Finance App"
        additionalMetaTags={[
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          },
        ]}
      />

      <Layout>
        <div
          className={`px-4 py-5 md:p-10 pb-20 md:pb-32 lg:pb-8 lg:pl-0 ${
            isSidebarOpen ? "lg:pr-10" : "lg:pr-20"
          }`}
        >
          <PageHeader
            buttonLabel="Add Pot"
            isOpen={isPotModalOpen}
            setIsOpen={setIsPotModalOpen}
            modalId="pot-modal"
          >
            <PotFormModal
              id="pot-modal"
              onClose={() => setIsPotModalOpen(false)}
              onSubmitForm={async () => await mutate()}
            />
          </PageHeader>

          {isValidating ? (
            <div className="flex flex-col w-full lg:grid lg:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonPotCard key={index} />
              ))}
            </div>
          ) : pots?.pots.length ? (
            <div className="flex flex-col w-full lg:grid lg:grid-cols-2 gap-6">
              {pots.pots.map((pot) => (
                <PotCard
                  key={pot.id}
                  potId={pot.id}
                  onSubmitForm={async () => await mutate()}
                />
              ))}
            </div>
          ) : (
            <EmptyContent
              content="Your pots are looking kind of empty!"
              description="Create pots to set money aside for specific goals or expenses."
              variant="secondary"
              icon={
                <img
                  src="/assets/images/icon-nav-pots.svg"
                  alt="Pot icon"
                  className="w-12 h-12"
                />
              }
              buttonLabel="Manage Pots"
            />
          )}
        </div>
      </Layout>
    </>
  );
}
