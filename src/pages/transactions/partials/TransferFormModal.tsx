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
import { InputBase } from "@/components/core/InputBase";
import InputLabel from "@/components/core/InputLabel";

const transferFormSchema = () =>
  z.object({
    amount: z.number().min(1, { message: "Amount must be greater than zero." }),
    description: z.string().optional(),
    recurrenceDay: z.number().optional(),
    recurrenceFrequency: z.string().optional(),
    recipientId: z.string().min(3, { message: "Recipient ID is required." }),
  });

export type TransferFormData = z.infer<ReturnType<typeof transferFormSchema>>;

const RecipientUser = ({
  avatarUrl,
  name,
}: {
  avatarUrl: string;
  name: string;
}) => (
  <div className="flex flex-col mt-3">
    <label className="text-xs font-bold text-gray-500 mb-1">Recipient</label>

    <div
      className="flex items-center gap-2 text-sm w-full h-12 rounded-md border border-beige-500 pl-3"
      role="group"
      aria-label={`Selected recipient: ${name}`}
    >
      <img
        src={avatarUrl}
        alt={`Avatar of ${name}`}
        className="w-7 h-7 rounded-full"
      />
      <p className="text-gray-900 font-bold text-xs">{name}</p>
    </div>
  </div>
);

interface TransferFormModalProps {
  id: string;
  onClose: () => void;
  onSubmitForm: () => Promise<void>;
  categories: CategoryProps[];
}

export function TransferFormModal({
  id,
  onClose,
  onSubmitForm,
  categories,
}: TransferFormModalProps) {
  const [isRecurring, setIsRecurring] = useState(false);

  const [recipientId, setRecipientId] = useState("");

  const [recipientUser, setRecipientUser] = useState<UserProps | null>(null);

  const [recurrenceDay, setRecurrenceDay] = useState(1);

  const [recurrenceFrequency, setRecurrenceFrequency] = useState("Monthly");

  const [selectedCategory, setSelectedCategory] = useState("General");

  const [isLoading, setIsLoading] = useState(false);

  const session = useSession();

  const { data: users } = useRequest<UserProps[]>(
    {
      url: "/users",
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

  /* ---------------------- Handlers ---------------------- */

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
        aria-label="Close transfer modal"
        className="fixed inset-0 z-[990] bg-black bg-opacity-70"
      />

      <Dialog.Content
        id={id}
        role="dialog"
        aria-modal="true"
        aria-labelledby="transfer-title"
        aria-describedby="transfer-description"
        className="max-h-[90vh] overflow-y-scroll fixed z-[999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] bg-white rounded-lg shadow-lg p-6 md:w-[560px] md:p-8"
      >
        <Dialog.Close
          aria-label="Close modal"
          onClick={() => {
            setRecipientUser(null);
            reset();
            onClose();
          }}
          className="absolute top-4 right-4 hover:bg-gray-900 hover:text-gray-100 transition-all duration-300 text-gray-500 p-[0.1rem] rounded-full border border-gray-900"
        >
          <X size={16} />
        </Dialog.Close>

        <Dialog.Title
          id="transfer-title"
          className="text-xl font-semibold text-gray-900 mb-2 md:text-2xl"
        >
          New Transfer
        </Dialog.Title>

        <Dialog.Description
          id="transfer-description"
          className="text-sm text-gray-600 mb-4"
        >
          Please fill the fields below to make a new transfer.
        </Dialog.Description>

        <form onSubmit={handleSubmit(handleTransfer)} className="mt-6">
          <div className="flex flex-col mt-2">
            <InputLabel htmlFor="recipientId">Recipient User</InputLabel>

            {users && formattedUsers && (
              <SelectUser
                label="Recipient"
                onSelect={handleSelectRecipient}
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
            <InputBase
              required
              label="Description"
              id="description"
              type="text"
              placeholder="e.g: Dinner Payment"
              error={errors?.description?.message}
              {...register("description")}
            />
          </div>

          <div className="flex flex-col my-4">
            <InputLabel>Category</InputLabel>

            <SelectInput
              label="Category"
              placeholder="Select Category..."
              defaultValue={"General"}
              onSelect={setSelectedCategory}
              data={categories}
            />
          </div>

          <InputBase
            required
            label="Amount ($)"
            id="amount"
            type="number"
            step="0.01"
            placeholder="Amount"
            error={errors?.description?.message}
            {...register("amount", { valueAsNumber: true })}
          />

          <div className="flex items-center justify-start w-full mt-4 gap-2">
            <input
              checked={isRecurring}
              onChange={() => setIsRecurring(!isRecurring)}
              id="isRecurring"
              type="checkbox"
              className="w-4 h-4 accent-gray-900"
            />

            <InputLabel className="mb-0" htmlFor="isRecurring">
              Is Recurring?
            </InputLabel>
          </div>

          {isRecurring && (
            <>
              <div className="flex flex-col mt-4">
                <InputLabel htmlFor="recurrenceFrequency">
                  Recurrence Frequency
                </InputLabel>

                <SelectInput
                  label="Recurrence Frequency"
                  placeholder="Recurrence Frequency"
                  defaultValue={"Monthly"}
                  data={recurrenceFrequencyOptions}
                  onSelect={setRecurrenceFrequency}
                />
              </div>

              <div className="flex flex-col mt-4">
                <InputLabel htmlFor="recurrenceDay">Recurrence Day</InputLabel>

                <SelectInput
                  label="Recurrence Day"
                  defaultValue={"1"}
                  placeholder="Recurrence Day"
                  data={daysInMonth}
                  onSelect={(value: string) => setRecurrenceDay(Number(value))}
                />
              </div>
            </>
          )}

          <PrimaryButton type="submit" isSubmitting={isSubmitting || isLoading}>
            Transfer
          </PrimaryButton>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
