/* eslint-disable react-hooks/exhaustive-deps */
import { PrimaryButton } from "@/components/core/PrimaryButton";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { SelectInput } from "@/components/core/SelectInput";
import { SelectUser } from "@/components/shared/SelectUser";
import { api } from "@/lib/axios";
import { CategoryProps } from "@/types/category";
import { UserProps } from "@/types/user";
import {
  AVATAR_URL_DEFAULT,
  recurrenceFrequencyOptions,
} from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import useRequest from "@/utils/useRequest";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { useSession } from "next-auth/react";

import { X } from "phosphor-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const transferFormSchema = () =>
  z.object({
    amount: z.number().min(1, { message: "Amount must be greater than zero." }),
    description: z.string().optional(),
    recurrenceDay: z.number().optional(),
    recurrenceFrequency: z.string().optional(),
    recipientId: z.string().min(3, { message: "Recipient ID is required." }),
  });

export type TransferFormData = z.infer<ReturnType<typeof transferFormSchema>>;

interface TransferModalProps {
  onClose: () => void;
  onSubmitForm: () => Promise<void>;
  categories: CategoryProps[];
}

const RecipientUser = ({
  avatarUrl,
  name,
}: {
  avatarUrl: string;
  name: string;
}) => (
  <div className="flex flex-col mt-3">
    <label className="text-xs font-bold text-gray-500 mb-1">Recipient</label>
    <div className="flex items-center gap-2 text-sm w-full h-12 rounded-md border border-beige-500 pl-3">
      <img
        src={avatarUrl}
        alt="Recipient Avatar"
        className="w-7 h-7 rounded-full"
      />
      <p className="text-gray-900 font-bold text-xs">{name}</p>
    </div>
  </div>
);

export function TransferModalForm({
  onClose,
  onSubmitForm,
  categories,
}: TransferModalProps) {
  const [isRecurring, setIsRecurring] = useState(false);

  const [recipientId, setRecipientId] = useState("");

  const [recipientUser, setRecipientUser] = useState<UserProps | null>(null);

  const [recurrenceDay, setRecurrenceDay] = useState(1);

  const [recurrenceFrequency, setRecurrenceFrequency] = useState("Monthly");

  const [selectedCategory, setSelectedCategory] = useState("General");

  const [isLoading, setIsLoading] = useState(false);

  const session = useSession();

  const { data: users } = useRequest<UserProps[]>({
    url: "/users",
    method: "GET",
  });

  const daysInMonth = Array.from({ length: 31 }, (_, index) => ({
    id: String(index + 1),
    name: String(index + 1),
  }));

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferFormSchema()),
    defaultValues: { amount: 0, description: "", recipientId: "" },
  });
  const handleTransfer = async (data: TransferFormData) => {
    const payload = {
      description: data.description || "",
      recipientId,
      categoryName: selectedCategory,
      amount: Number(data.amount),
      isRecurring,
      recurrenceFrequency,
      recurrenceDay,
    };

    try {
      const response = await api.post(`/transactions`, payload);

      setRecipientUser(response?.data?.profile || null);

      toast?.success(response?.data?.message);

      await onSubmitForm();

      reset();
      setRecipientUser(null);
      onClose();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleFetchRecipientUser = async (recipientId: string) => {
    setIsLoading(true);

    try {
      const response = await api.get(`/profile/recipient/${recipientId}`);
      setRecipientUser(response?.data?.profile || null);
      toast?.success(response?.data?.message);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRecipient = async (value: string) => {
    setRecipientId(value);

    setValue("recipientId", value);

    await handleFetchRecipientUser(value);
  };

  const formattedUsers = users
    ?.filter((user) => user.id !== session?.data?.user?.id)
    .map((user) => ({
      id: user.id,
      name: user.name,
    }));

  return (
    <Dialog.Portal>
      <Dialog.Overlay
        className="fixed inset-0 z-[990] bg-black bg-opacity-70"
        onClick={() => {
          onClose();
          setRecipientUser(null);
          reset();
        }}
      />
      <Dialog.Content className="max-h-[90vh] overflow-scroll fixed z-[999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] bg-white rounded-lg shadow-lg p-6 md:w-[560px] md:p-8">
        <Dialog.Close
          onClick={() => {
            onClose();
            setRecipientUser(null);
          }}
          className="absolute top-4 right-4 hover:bg-gray-900 hover:text-gray-100 transition-all duration-300 text-gray-500 p-[0.1rem] rounded-full border border-gray-900"
        >
          <X size={16} alt="Close modal" />
        </Dialog.Close>

        <Dialog.Title className="text-xl font-semibold text-gray-900 mb-2 md:text-2xl">
          New Transfer
        </Dialog.Title>

        <Dialog.Description className="flex flex-col w-full">
          <p className="text-sm text-gray-600">
            Please, fill the fields above in order to make a new transfer.
          </p>

          <form className="mt-6" onSubmit={handleSubmit(handleTransfer)}>
            <div className="flex flex-col mt-2">
              <label className="text-xs font-bold text-gray-500 mb-1">
                Recipient User
              </label>
              {users && formattedUsers && (
                <SelectUser
                  label="Recipient"
                  onSelect={async (value: string) => {
                    await handleSelectRecipient(value);
                  }}
                  data={formattedUsers}
                  placeholder="Select a Recipient"
                />
              )}
              {errors.recipientId && (
                <ErrorMessage
                  id="recipient-error"
                  message={errors.recipientId.message}
                />
              )}
            </div>

            {recipientUser && (
              <RecipientUser
                name={recipientUser.name}
                avatarUrl={recipientUser?.avatarUrl || AVATAR_URL_DEFAULT}
              />
            )}

            <div className="flex flex-col mt-4">
              <label className="text-xs font-bold text-gray-500 mb-1">
                Description
              </label>
              <input
                type="text"
                id="description"
                className="text-sm w-full h-12 rounded-md border border-beige-500 px-3"
                placeholder="e.g: Dinner Payment"
                {...register("description")}
              />
              {errors.description && (
                <ErrorMessage
                  id="description-error"
                  message={errors.description.message}
                />
              )}
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-xs font-bold text-gray-500 mb-1">
                Category
              </label>
              <SelectInput
                label="Category"
                placeholder="Select Category..."
                defaultValue={"General"}
                onSelect={(value: string) => setSelectedCategory(value)}
                data={categories}
              />
            </div>

            <div className="flex flex-col mt-4">
              <label
                htmlFor="amount"
                className="text-xs font-bold text-gray-500 mb-1"
              >
                Amount ($)
              </label>
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  id="amount"
                  className="text-sm w-full h-12 rounded-md border border-beige-500 pl-[1.8rem] pr-3"
                  placeholder="Amount"
                  {...register("amount", { valueAsNumber: true })}
                />
              </div>
              {errors.amount && (
                <ErrorMessage
                  id="amount-error"
                  message={errors.amount.message}
                />
              )}
            </div>

            <div className="flex items-center justify-start w-full mt-4 gap-2">
              <input
                checked={isRecurring}
                onChange={() => setIsRecurring(!isRecurring)}
                id="default-checkbox"
                type="checkbox"
                className="w-4 h-4 accent-gray-900"
              />
              <label
                htmlFor="default-checkbox"
                className="text-sm text-gray-500 font-bold"
              >
                Is Recurring?
              </label>
            </div>

            {isRecurring && (
              <>
                <div className="flex flex-col mt-4">
                  <label className="text-xs font-bold text-gray-500 mb-1">
                    Recurrence Frequency
                  </label>
                  <SelectInput
                    label="Recurrence Frequency"
                    placeholder="Recurrence Frequency"
                    defaultValue={"Monthly"}
                    data={recurrenceFrequencyOptions}
                    onSelect={setRecurrenceFrequency}
                  />
                </div>

                <div className="flex flex-col mt-4">
                  <label className="text-xs font-bold text-gray-500 mb-1">
                    Recurrence Day
                  </label>
                  <SelectInput
                    label="Recurrence Day"
                    defaultValue={"1"}
                    placeholder="Recurrence Day"
                    data={daysInMonth}
                    onSelect={(value: string) =>
                      setRecurrenceDay(Number(value))
                    }
                  />
                </div>
              </>
            )}
            <PrimaryButton
              type="submit"
              isSubmitting={isSubmitting || isLoading}
            >
              Transfer
            </PrimaryButton>
          </form>
        </Dialog.Description>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
