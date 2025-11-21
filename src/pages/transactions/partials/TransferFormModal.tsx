/* eslint-disable react-hooks/exhaustive-deps */
import { PrimaryButton } from "@/components/core/PrimaryButton";
import { SelectInput } from "@/components/core/SelectInput";
import { api } from "@/lib/axios";
import { CategoryProps } from "@/types/category";
import { avatarUrls, recurrenceFrequencyOptions } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { Controller, useForm } from "react-hook-form";

import { X } from "phosphor-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { InputBase } from "@/components/core/InputBase";
import InputLabel from "@/components/core/InputLabel";
import { AvatarSelectInput } from "@/components/core/AvatarSelectInput";

const transferFormSchema = () =>
  z.object({
    amount: z.number().min(1, { message: "Amount must be greater than zero." }),
    description: z.string().optional(),
    type: z.enum(["income", "expense"], {
      required_error: "Transaction type is required.",
    }),
    recurrenceDay: z.number().optional(),
    recurrenceFrequency: z.string().optional(),
    contactName: z.string().min(3, { message: "Recipient name is required." }),
    contactAvatar: z
      .string()
      .min(3, { message: "Recipient avatar is required." }),
  });

const transactionTypeOptions = [
  { id: "expense", name: "Expense" },
  { id: "income", name: "Income" },
];

export type TransferFormData = z.infer<ReturnType<typeof transferFormSchema>>;

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

  const [recurrenceDay, setRecurrenceDay] = useState(1);

  const [recurrenceFrequency, setRecurrenceFrequency] = useState("Monthly");

  const [selectedCategory, setSelectedCategory] = useState("General");

  const [selectedAvatar, setSelectedAvatar] = useState(avatarUrls[0]);

  const daysInMonth = Array.from({ length: 31 }, (_, index) => ({
    id: String(index + 1),
    name: String(index + 1),
  }));

  const {
    handleSubmit,
    setValue,
    control,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferFormSchema()),
    defaultValues: {
      amount: 0,
      description: "",
      contactName: "",
      contactAvatar: selectedAvatar,
      type: "expense",
    },
  });

  const handleAvatarSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    setValue("contactAvatar", avatarUrl);
  };

  const handleTransfer = async (data: TransferFormData) => {
    const payload = {
      description: data.description || "",
      categoryName: selectedCategory,
      amount: Number(data.amount),
      contactName: data.contactName,
      contactAvatar: selectedAvatar,
      type: data.type,
      isRecurring,
      recurrenceFrequency,
      recurrenceDay,
    };

    try {
      const response = await api.post(`/transactions`, payload);

      toast?.success(response?.data?.message);
      await onSubmitForm();

      reset();
      onClose();
    } catch (error) {
      handleApiError(error);
    }
  };
  console.log(watch(), errors);
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
          className="text-sm text-gray-600"
        >
          Please fill the fields below to make a new transfer.
        </Dialog.Description>

        <form onSubmit={handleSubmit(handleTransfer)} className="mt-2">
          <div className="flex items-start justify-center w-full">
            <div className="flex flex-col mt-4 mr-4">
              <InputLabel>Avatar</InputLabel>

              <AvatarSelectInput
                label="Recipient Avatar"
                placeholder="Select an avatar"
                defaultValue={selectedAvatar}
                onSelect={handleAvatarSelect}
                data={avatarUrls}
              />

              {errors?.contactAvatar?.message && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.contactAvatar.message}
                </span>
              )}
            </div>

            <div className="flex flex-col w-full mt-4">
              <Controller
                name="contactName"
                control={control}
                render={({ field, fieldState }) => (
                  <InputBase
                    required
                    label="Recipient name"
                    id="recipient-name"
                    type="text"
                    placeholder="e.g: Jon Doe"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex flex-col mt-4">
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <InputBase
                  required
                  label="Description"
                  id="description"
                  type="text"
                  placeholder="e.g: Dinner Payment"
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
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

          <Controller
            name="amount"
            control={control}
            render={({ field, fieldState }) => (
              <InputBase
                required
                label="Amount ($)"
                id="amount"
                type="number"
                step="0.01"
                placeholder="Amount"
                error={fieldState.error?.message}
                {...field}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : parseFloat(e.target.value);
                  field.onChange(value);
                }}
                value={field.value || ""}
              />
            )}
          />

          <div className="flex flex-col my-4">
            <InputLabel>Transaction Type</InputLabel>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <SelectInput
                  label="Transaction Type"
                  placeholder="Select Type..."
                  defaultValue={"expense"}
                  onSelect={(value) => field.onChange(value.toLowerCase())}
                  data={transactionTypeOptions}
                />
              )}
            />
          </div>

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

          <PrimaryButton
            className="mt-8"
            type="submit"
            isSubmitting={isSubmitting}
          >
            Transfer
          </PrimaryButton>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
