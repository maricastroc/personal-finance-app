/* eslint-disable react-hooks/exhaustive-deps */
import { PrimaryButton } from "@/components/core/PrimaryButton";
import { SelectInput } from "@/components/core/SelectInput";
import { api } from "@/lib/axios";
import { CategoryProps } from "@/types/category";
import { TransactionProps } from "@/types/transaction";
import { avatarUrls, TRANSFER_CONSTRAINTS } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { InputBase } from "@/components/core/InputBase";
import InputLabel from "@/components/core/InputLabel";
import { AvatarSelectInput } from "@/components/core/AvatarSelectInput";
import { CurrencyInput } from "@/components/core/CurrencyInput";
import { Modal } from "@/components/shared/Modal";
import { format } from "date-fns";
import { DatePicker } from "@/components/core/DatePicker";
import { useBalance } from "@/contexts/BalanceContext";
import { formatToDollar } from "@/utils/formatToDollar";
import { WarningSection } from "@/components/shared/WarningSection";
import { toZonedTime } from "date-fns-tz";

const transactionFormSchema = () =>
  z.object({
    amount: z
      .number({ invalid_type_error: "Amount must be a number." })
      .min(1, { message: "Amount must be greater than zero." })
      .max(TRANSFER_CONSTRAINTS.MAX_LIMIT, {
        message: `Target amount cannot exceed ${formatToDollar(
          TRANSFER_CONSTRAINTS.MAX_LIMIT
        )}`,
      }),
    description: z
      .string()
      .max(20, { message: "Description cannot exceed 20 characters." })
      .optional(),
    type: z.enum(["income", "expense"], {
      required_error: "Transaction type is required.",
    }),
    recurrenceDay: z.number().optional(),
    recurrenceFrequency: z.string().optional(),
    contactName: z
      .string()
      .min(3, { message: "Recipient name must have at least 3 characters." })
      .max(20, { message: "Recipient name cannot exceed 20 characters." }),
    contactAvatar: z
      .string()
      .min(1, { message: "Recipient avatar is required." }),
    date: z.string().min(1, { message: "Date is required." }),
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
  transaction?: TransactionProps | null;
  isEdit?: boolean;
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

  const [selectedCategory, setSelectedCategory] = useState(
    transaction?.category?.name || "General"
  );

  const [selectedAvatar, setSelectedAvatar] = useState(avatarUrls[0]);

  const daysInMonth = Array.from({ length: 31 }, (_, index) => ({
    id: String(index + 1),
    name: String(index + 1),
  }));

  const { refetchBalance } = useBalance();

  const {
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema()),
    defaultValues: {
      amount: 0,
      description: "",
      contactName: "",
      contactAvatar: selectedAvatar,
      type: "expense",
      date: format(new Date(), "yyyy-MM-dd"),
    },
  });

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
      date: data.date,
      isRecurring,
      recurrenceFrequency: isRecurring ? recurrenceFrequency : undefined,
      recurrenceDay: isRecurring ? recurrenceDay : undefined,
    };

    try {
      let response;

      if (isEdit && transaction) {
        response = await api.put(`/transactions/${transaction.id}`, payload);
        toast?.success(
          response?.data?.message || "Transaction updated successfully!"
        );
      } else {
        response = await api.post(`/transactions`, payload);

        toast?.success(
          response?.data?.message || "Transaction created successfully!"
        );
      }

      await onSubmitForm();
      await refetchBalance();

      setRecurrenceDay(1);
      setRecurrenceFrequency("Monthly");
      setIsRecurring(false);
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

  useEffect(() => {
    if (transaction && isEdit) {
      setValue("amount", Math.abs(transaction.amount));
      setValue("description", transaction.description || "");
      setValue("contactName", transaction.contactName);
      setValue("contactAvatar", transaction.contactAvatar);
      setValue("type", transaction.balance as "income" | "expense");

      setValue(
        "date",
        format(toZonedTime(transaction.date, "UTC"), "yyyy-MM-dd")
      );

      setSelectedAvatar(transaction.contactAvatar);
      setSelectedCategory(transaction.category?.name || "General");
      setIsRecurring(transaction.isRecurring);

      if (transaction.isRecurring) {
        setValue(
          "recurrenceDay",
          Number(transaction?.recurringBill?.recurrenceDay)
        );
        setRecurrenceDay(Number(transaction?.recurringBill?.recurrenceDay));

        setValue(
          "recurrenceFrequency",
          transaction?.recurringBill?.recurrenceFrequency
        );
        setRecurrenceFrequency(
          transaction?.recurringBill?.recurrenceFrequency as string
        );
      }
    }
  }, [transaction, isEdit, setValue]);

  useEffect(() => {
    if (!isRecurring) {
      setValue("recurrenceFrequency", undefined);
      setValue("recurrenceDay", undefined);
    }
  }, [isRecurring]);

  useEffect(() => {
    if (watch().type === "expense") {
      setIsRecurring(false);
      setValue("recurrenceFrequency", undefined);
      setValue("recurrenceDay", undefined);
    }
  }, [watch().type]);

  return (
    <Modal
      id={id}
      title={modalTitle}
      description={modalDescription}
      onClose={onClose}
    >
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

        <div className="flex flex-col mt-4">
          <InputLabel>Transaction Date</InputLabel>
          <Controller
            name="date"
            control={control}
            render={({ field, fieldState }) => (
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                isEdit={isEdit}
                originalDate={
                  transaction?.date
                    ? format(new Date(transaction.date), "yyyy-MM-dd")
                    : undefined
                }
              />
            )}
          />
        </div>

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

        {watch().type === "expense" && !isEdit && (
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
        )}

        {isRecurring && watch().type === "expense" && (
          <div className="flex flex-col mt-4">
            <InputLabel htmlFor="recurrenceDay">Recurrence Day</InputLabel>

            <Controller
              name="recurrenceDay"
              control={control}
              render={({ field }) => (
                <SelectInput
                  label="Recurrence Day"
                  defaultValue={String(recurrenceDay)}
                  placeholder="Recurrence Day"
                  data={daysInMonth}
                  onSelect={(value) => {
                    field.onChange(Number(value));
                    setRecurrenceDay(Number(value));
                  }}
                />
              )}
            />

            <WarningSection title="Transactions marked as recurring always repeat monthly and are managed in the Recurring Bills area. Go there to view or pay your scheduled bills." />
          </div>
        )}

        <PrimaryButton
          className="mt-8"
          type="submit"
          isSubmitting={isSubmitting}
        >
          {submitButtonText}
        </PrimaryButton>
      </form>
    </Modal>
  );
}
