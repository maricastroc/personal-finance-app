/* eslint-disable react-hooks/exhaustive-deps */
import * as Dialog from "@radix-ui/react-dialog";
import { PrimaryButton } from "@/components/core/PrimaryButton";
import { SelectInput } from "@/components/core/SelectInput";
import { api } from "@/lib/axios";
import { CategoryProps } from "@/types/category";
import { TransactionProps } from "@/types/transaction";
import { avatarUrls, recurrenceFrequencyOptions } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { X } from "phosphor-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { InputBase } from "@/components/core/InputBase";
import InputLabel from "@/components/core/InputLabel";
import { AvatarSelectInput } from "@/components/core/AvatarSelectInput";
import { CurrencyInput } from "@/components/core/CurrencyInput";

const transactionFormSchema = () =>
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
      .min(1, { message: "Recipient avatar is required." }),
  });

const transactionTypeOptions = [
  { id: "expense", name: "Expense" },
  { id: "income", name: "Income" },
];

export type TransactionFormData = z.infer<
  ReturnType<typeof transactionFormSchema>
>;

interface TransferFormModalProps {
  id: string;
  onClose: () => void;
  onSubmitForm: () => Promise<void>;
  categories: CategoryProps[];
  transaction?: TransactionProps | null; // Para edição
  isEdit?: boolean; // Para distinguir entre criar e editar
}

export function TransferFormModal({
  id,
  onClose,
  onSubmitForm,
  categories,
  transaction = null,
  isEdit = false,
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
    reset,
    formState: { isSubmitting, errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema()),
    defaultValues: {
      amount: 0,
      description: "",
      contactName: "",
      contactAvatar: selectedAvatar,
      type: "expense",
    },
  });

  useEffect(() => {
    if (transaction && isEdit) {
      setValue("amount", Math.abs(transaction.amount));
      setValue("description", transaction.description || "");
      setValue("contactName", transaction.contactName);
      setValue("contactAvatar", transaction.contactAvatar);
      setValue("type", transaction.balance as "income" | "expense");

      setSelectedAvatar(transaction.contactAvatar);
      setSelectedCategory(transaction.category?.name || "General");
      setIsRecurring(transaction.isRecurring);

      if (transaction.isRecurring) {

      }
    }
  }, [transaction, isEdit, setValue]);

  const handleAvatarSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    setValue("contactAvatar", avatarUrl, { shouldValidate: true });
  };

  const handleSubmitForm = async (data: TransactionFormData) => {
    const payload = {
      description: data.description || "",
      categoryName: selectedCategory,
      amount:
        data.type === "expense"
          ? -Math.abs(data.amount)
          : Math.abs(data.amount),
      contactName: data.contactName,
      contactAvatar: data.contactAvatar,
      type: data.type,
      isRecurring,
      recurrenceFrequency: isRecurring ? recurrenceFrequency : undefined,
      recurrenceDay: isRecurring ? recurrenceDay : undefined,
    };

    try {
      let response;

      if (isEdit && transaction) {
        // Editar transação existente
        response = await api.put(`/transactions/${transaction.id}`, payload);
        toast?.success(
          response?.data?.message || "Transaction updated successfully!"
        );
      } else {
        // Criar nova transação
        response = await api.post(`/transactions`, payload);
        toast?.success(
          response?.data?.message || "Transaction created successfully!"
        );
      }

      await onSubmitForm();
      reset();
      onClose();
    } catch (error) {
      handleApiError(error);
    }
  };

  const modalTitle = isEdit ? "Edit Transaction" : "New Transaction";
  const modalDescription = isEdit
    ? "Update the transaction details below."
    : "Please fill the fields below to create a new transaction.";
  const submitButtonText = isEdit ? "Update Transaction" : "Create Transaction";

  return (
    <Dialog.Portal>
      <Dialog.Overlay
        aria-label="Close transaction modal"
        className="fixed inset-0 z-[990] bg-black bg-opacity-10"
      />

      <Dialog.Content
        id={id}
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-title"
        aria-describedby="transaction-description"
        className="max-h-[90vh] overflow-y-scroll fixed z-[999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] bg-white rounded-lg shadow-lg p-6 md:w-[560px] md:p-8"
      >
        <Dialog.Close
          aria-label="Close modal"
          onClick={() => {
            reset();
            onClose();
          }}
          className="absolute top-4 right-4 hover:bg-grey-900 hover:text-white transition-all duration-300 text-grey-500 p-[0.1rem] rounded-full border border-grey-900"
        >
          <X size={16} />
        </Dialog.Close>

        <Dialog.Title
          id="transaction-title"
          className="text-xl font-semibold text-grey-900 mb-2 md:text-2xl"
        >
          {modalTitle}
        </Dialog.Title>

        <Dialog.Description
          id="transaction-description"
          className="text-sm text-grey-500"
        >
          {modalDescription}
        </Dialog.Description>

        <form onSubmit={handleSubmit(handleSubmitForm)} className="mt-2">
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
              defaultValue={selectedCategory}
              onSelect={setSelectedCategory}
              data={categories}
            />
          </div>

          <Controller
            name="amount"
            control={control}
            render={({ field, fieldState }) => (
              <CurrencyInput
                label="Amount ($)"
                value={field.value}
                onValueChange={field.onChange}
                id="amount"
                placeholder="$0.00"
                error={fieldState.error?.message}
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
                  defaultValue={field.value === "income" ? "Income" : "Expense"}
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
              className="w-4 h-4 accent-grey-900"
            />

            <InputLabel className="mt-1" htmlFor="isRecurring">
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
            {submitButtonText}
          </PrimaryButton>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
