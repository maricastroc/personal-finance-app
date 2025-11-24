/* eslint-disable @typescript-eslint/no-explicit-any */
import { CurrencyInput } from "@/components/core/CurrencyInput";
import { InputBase } from "@/components/core/InputBase";
import { PrimaryButton } from "@/components/core/PrimaryButton";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Modal } from "@/components/shared/Modal";
import { api } from "@/lib/axios";
import { PotProps } from "@/types/pot";
import { PotsResult } from "@/types/pots-result";
import { handleApiError } from "@/utils/handleApiError";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosResponse } from "axios";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { PotThemeSelector } from "./PotThemeSelector";
import { POT_CONSTRAINTS } from "@/utils/constants";
import { formatToDollar } from "@/utils/formatToDollar";

interface PotFormModalProps {
  id: string;
  onClose: () => void;
  pots: PotProps[] | undefined;
  pot?: PotProps;
  isEdit?: boolean;
  onSubmitForm: () => Promise<
    void | AxiosResponse<PotsResult, any> | undefined
  >;
}

const potFormSchema = () =>
  z.object({
    name: z
      .string()
      .min(3, { message: "Name must have at least 3 characters." })
      .max(20, { message: "Name cannot exceed 20 characters." }),
    targetAmount: z
      .number({ invalid_type_error: "Amount must be a number." })
      .min(1, { message: "Amount must be greater than zero." })
      .max(POT_CONSTRAINTS.MAX_LIMIT, {
        message: `Target amount cannot exceed ${formatToDollar(
          POT_CONSTRAINTS.MAX_LIMIT
        )}`,
      }),
    currentAmount: z
      .number({ invalid_type_error: "Amount must be a number." })
      .optional(),
    themeId: z.string().min(1, { message: "Theme is required." }),
  });

export type PotFormData = z.infer<ReturnType<typeof potFormSchema>>;

export function PotFormModal({
  id,
  onClose,
  pot,
  pots,
  onSubmitForm,
  isEdit = false,
}: PotFormModalProps) {
  const potFormTitle = isEdit ? "Edit Pot" : "Add New Pot";

  const potFormDescription = isEdit
    ? "If your saving targets change, feel free to update your pots."
    : "Create a pot to set savings targets. These can help keep you on track as you save for special purchases.";

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<PotFormData>({
    resolver: zodResolver(potFormSchema()),
    defaultValues: {
      name: isEdit ? pot?.name : "",
      targetAmount: isEdit ? pot?.targetAmount : 0,
      themeId: isEdit ? pot?.themeId : "",
      currentAmount: isEdit ? pot?.currentAmount : 0,
    },
  });

  const handleEditPot = async (data: PotFormData) => {
    try {
      const payload = {
        name: data.name,
        themeId: data.themeId,
        targetAmount: data.targetAmount,
        currentAmount: data.currentAmount,
      };

      const response = await api.put(`/pots/${pot?.id}`, payload);

      toast?.success(response.data.message);
      await onSubmitForm();
      reset();
      onClose();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleCreatePot = async (data: PotFormData) => {
    try {
      const payload = {
        name: data.name,
        themeId: data.themeId,
        targetAmount: data.targetAmount,
      };

      const response = await api.post(`/pots`, payload);

      toast?.success(response.data.message);
      await onSubmitForm();
      reset();
      onClose();
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    if (isEdit && pot) {
      reset({
        name: pot.name,
        targetAmount: pot.targetAmount,
        currentAmount: pot.currentAmount ?? 0,
        themeId: pot.theme?.id,
      });
    }
  }, [isEdit, pot, reset]);

  return (
    <Modal
      id={id}
      onClose={onClose}
      title={potFormTitle}
      description={potFormDescription}
    >
      <form
        className="mt-4 space-y-4"
        onSubmit={
          isEdit ? handleSubmit(handleEditPot) : handleSubmit(handleCreatePot)
        }
      >
        <div className="flex flex-col w-full mt-4">
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <InputBase
                label="Pot name"
                id="name"
                type="text"
                placeholder="e.g: College funds"
                error={fieldState.error?.message}
                {...field}
              />
            )}
          />
        </div>

        <div className="flex flex-col mt-4">
          <Controller
            name="targetAmount"
            control={control}
            render={({ field, fieldState }) => (
              <CurrencyInput
                label="Target Amount ($)"
                value={field.value}
                onValueChange={field.onChange}
                id="targetAmount"
                placeholder="$0.00"
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-grey-500 mb-1 block">
            Theme Color
          </label>

          <Controller
            name="themeId"
            control={control}
            render={({ field }) => (
              <PotThemeSelector
                pots={pots}
                pot={pot}
                onSelect={(themeId: string) => field.onChange(themeId)}
              />
            )}
          />

          {errors.themeId && (
            <ErrorMessage
              id="theme-id-error"
              message={errors.themeId.message}
            />
          )}
        </div>

        <PrimaryButton
          className="mt-8"
          type="submit"
          isSubmitting={isSubmitting}
        >
          Save Changes
        </PrimaryButton>
      </form>
    </Modal>
  );
}
