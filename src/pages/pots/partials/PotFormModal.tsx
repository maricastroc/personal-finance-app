/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrimaryButton } from "@/components/core/PrimaryButton";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { SelectTheme } from "@/components/shared/SelectTheme";
import { api } from "@/lib/axios";
import { AllPotsProps } from "@/pages/home/index.page";
import { getThemeOptions } from "@/utils/getThemeOptions";
import { handleApiError } from "@/utils/handleApiError";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { AxiosResponse } from "axios";
import { X } from "phosphor-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface PotFormModalProps {
  id: string;
  onClose: () => void;
  targetAmount?: number;
  currentAmount?: number;
  themeColor?: string;
  potId?: string;
  name?: string;
  isEdit?: boolean;
  onSubmitForm: () => Promise<
    void | AxiosResponse<AllPotsProps, any> | undefined
  >;
}

const potFormSchema = () =>
  z.object({
    name: z.string().min(3, { message: "Name is required." }),
    targetAmount: z
      .number({ invalid_type_error: "Amount must be a number." })
      .min(1, { message: "Amount must be greater than zero." }),
    currentAmount: z
      .number({ invalid_type_error: "Amount must be a number." })
      .optional(),
    themeColor: z.string().min(3, { message: "Theme is required." }),
  });

export type PotFormData = z.infer<ReturnType<typeof potFormSchema>>;

export function PotFormModal({
  id,
  onClose,
  name,
  targetAmount,
  currentAmount,
  themeColor,
  potId,
  onSubmitForm,
  isEdit = false,
}: PotFormModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<PotFormData>({
    resolver: zodResolver(potFormSchema()),
    defaultValues: {
      name: isEdit ? name : "",
      targetAmount: isEdit ? targetAmount : 0,
      themeColor: isEdit ? themeColor : "",
      currentAmount: isEdit ? currentAmount : 0,
    },
  });

  const handleEditPot = async (data: PotFormData) => {
    try {
      const payload = {
        name: data.name,
        themeColor: data.themeColor,
        targetAmount: data.targetAmount,
        currentAmount: data.currentAmount,
      };

      const response = await api.put(`/pots/${potId}`, payload);

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
        themeColor: data.themeColor,
        targetAmount: data.targetAmount,
      };

      const response = await api.post(`/pots/${potId}`, payload);

      toast?.success(response.data.message);
      await onSubmitForm();
      reset();
      onClose();
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    if (isEdit) {
      reset({
        name,
        targetAmount,
        currentAmount,
        themeColor,
      });
    }
  }, [isEdit, name, themeColor, targetAmount, currentAmount, reset]);

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[990] bg-black/70 data-[state=open]:animate-overlayShow" />

      <Dialog.Content
        id={id}
        className="fixed z-[999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
        w-[90vw] bg-white rounded-lg shadow-lg p-6 
        md:w-[560px] md:p-8 
        data-[state=open]:animate-contentShow"
      >
        <Dialog.Close
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-grey-500 hover:bg-grey-900 hover:text-white transition-colors duration-300 p-1 rounded-full border border-grey-900"
        >
          <X size={16} />
        </Dialog.Close>

        <Dialog.Title className="text-xl font-semibold text-grey-900 mb-2 md:text-2xl">
          {isEdit ? "Edit Pot" : "Add New Pot"}
        </Dialog.Title>

        <Dialog.Description className="flex flex-col w-full text-sm text-grey-500 mb-4">
          {isEdit
            ? "If your saving targets change, feel free to update your pots."
            : "Create a pot to set savings targets. These can help keep you on track as you save for special purchases."}
        </Dialog.Description>

        <form
          className="mt-4 space-y-4"
          onSubmit={
            isEdit ? handleSubmit(handleEditPot) : handleSubmit(handleCreatePot)
          }
        >
          <div>
            <label className="text-xs font-bold text-grey-500 mb-1 block">
              Pot Name
            </label>
            <input
              type="text"
              id="name"
              className="text-sm w-full h-12 rounded-md border border-beige-500 px-3"
              placeholder="Name"
              {...register("name")}
            />
            {errors.name && (
              <ErrorMessage id="pot-name-error" message={errors.name.message} />
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-grey-500 mb-1 block">
              Target Amount ($)
            </label>

            <div className="relative w-full">
              <span className="absolute inset-y-0 left-3 flex items-center text-grey-500">
                $
              </span>

              <input
                type="number"
                step="0.01"
                id="targetAmount"
                className="text-sm w-full h-12 rounded-md border border-beige-500 pl-[1.8rem] pr-3"
                placeholder="Target Amount"
                {...register("targetAmount", { valueAsNumber: true })}
              />
            </div>

            {errors.targetAmount && (
              <ErrorMessage
                id="target-amount-error"
                message={errors.targetAmount.message}
              />
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-grey-500 mb-1 block">
              Theme Color
            </label>

            <SelectTheme
              defaultValue={themeColor}
              data={getThemeOptions}
              onSelect={(value) => setValue("themeColor", value)}
            />

            {errors.themeColor && (
              <ErrorMessage
                id="theme-color-error"
                message={errors.themeColor.message}
              />
            )}
          </div>

          <PrimaryButton type="submit" isSubmitting={isSubmitting}>
            Save Changes
          </PrimaryButton>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
