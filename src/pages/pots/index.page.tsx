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
import useRequest from "@/utils/useRequest";
import { useLoadingOnRouteChange } from "@/utils/useLoadingOnRouteChange";
import { PotsResult } from "@/types/pots-result";
import { ThemeProps } from "@/types/theme";

export default function Pots() {
  const { isSidebarOpen } = useAppContext();

  const isRouteLoading = useLoadingOnRouteChange();

  const [isPotModalOpen, setIsPotModalOpen] = useState(false);

  const { data, mutate, isValidating } = useRequest<PotsResult>(
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

  const { data: themesData, isValidating: isValidatingThemes } = useRequest<
    ThemeProps[]
  >(
    {
      url: "/themes",
      method: "GET",
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
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
              themes={themesData}
              pots={data?.pots}
              onClose={() => setIsPotModalOpen(false)}
              onSubmitForm={async () => await mutate()}
            />
          </PageHeader>

          {isValidating || isValidatingThemes ? (
            <div className="flex flex-col w-full lg:grid lg:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonPotCard key={index} />
              ))}
            </div>
          ) : data?.pots?.length ? (
            <div className="flex flex-col w-full lg:grid lg:grid-cols-2 gap-6">
              {data.pots.map((pot) => (
                <PotCard
                  key={pot.id}
                  pot={pot}
                  themes={themesData}
                  pots={data?.pots}
                  mutate={mutate}
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
