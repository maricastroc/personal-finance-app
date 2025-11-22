import { PrimaryButton } from "@/components/core/PrimaryButton";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { SelectInput } from "@/components/core/SelectInput";
import { SelectTheme } from "@/components/shared/SelectTheme";
import { api } from "@/lib/axios";
import { CategoryProps } from "@/types/category";
import { getThemeOptions } from "@/utils/getThemeOptions";
import { handleApiError } from "@/utils/handleApiError";
import useRequest from "@/utils/useRequest";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Modal } from "@/components/shared/Modal";
import { CurrencyInput } from "@/components/core/CurrencyInput";
import InputLabel from "@/components/core/InputLabel";

interface EditBudgetModalProps {
  id: string;
  onClose: () => void;
  categoryName?: string;
  budgetLimit?: number;
  existedCategories?: string[];
  theme?: string;
  budgetId?: string;
  isEdit?: boolean;
  onSubmitForm: () => Promise<void>;
}

const budgetFormSchema = () =>
  z.object({
    category: z.string().min(3, { message: "Category is required." }),
    budgetLimit: z
      .number({ invalid_type_error: "Amount must be a number." })
      .min(1, { message: "Amount must be greater than zero." }),
    theme: z.string().min(3, { message: "Theme is required." }),
  });

export type BudgetFormData = z.infer<ReturnType<typeof budgetFormSchema>>;

export function BudgetModal({
  id,
  onClose,
  categoryName,
  budgetLimit,
  theme,
  budgetId,
  existedCategories,
  onSubmitForm,
  isEdit = false,
}: EditBudgetModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetFormSchema()),
    defaultValues: {
      category: isEdit ? categoryName : "",
      budgetLimit: isEdit ? budgetLimit : undefined,
      theme: isEdit ? theme : "",
    },
  });

  const modalTitle = isEdit ? "Edit Budget" : "Add New Budget";

  const modalDescription = isEdit
    ? "As your budgets change, feel free to update your spending limits."
    : "Choose a category to set a spending budget. These categories can help you monitor spending.";

  const { data: categories } = useRequest<CategoryProps[]>({
    url: "/categories",
    method: "GET",
  });

  const handleEditBudget = async (data: BudgetFormData) => {
    try {
      const payload = {
        categoryName: data.category,
        themeColor: data.theme,
        amount: data.budgetLimit,
      };

      const response = await api.put(`/budgets/${budgetId}`, payload);

      toast.success(response.data.message);
      await onSubmitForm();
      reset();
      onClose();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleCreateBudget = async (data: BudgetFormData) => {
    try {
      const payload = {
        categoryName: data.category,
        themeColor: data.theme,
        amount: data.budgetLimit,
      };

      const response = await api.post(`/budgets`, payload);

      toast.success(response.data.message);
      await onSubmitForm();
      reset();
      onClose();
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Modal
      id={id}
      onClose={onClose}
      title={modalTitle}
      description={modalDescription}
    >
      <form
        className="mt-6"
        onSubmit={
          isEdit
            ? handleSubmit(handleEditBudget)
            : handleSubmit(handleCreateBudget)
        }
      >
        <div className="flex flex-col">
          <InputLabel htmlFor="budgetCategory">Budget Category</InputLabel>

          {categories && (
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <SelectInput
                  label="Category"
                  placeholder="Select a Category..."
                  existedCategories={existedCategories}
                  defaultValue={categoryName}
                  onSelect={(value) => field.onChange(value.toLowerCase())}
                  data={categories}
                />
              )}
            />
          )}

          {errors.category && (
            <ErrorMessage
              id="category-error"
              message={errors.category.message}
            />
          )}
        </div>

        <div className="flex flex-col mt-4">
          <Controller
            name="budgetLimit"
            control={control}
            render={({ field, fieldState }) => (
              <CurrencyInput
                label="Maximum Spend ($)"
                value={field.value}
                onValueChange={field.onChange}
                id="budgetLimit"
                placeholder="$0.00"
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        <div className="flex flex-col mt-4">
          <label
            htmlFor="theme"
            className="text-xs font-bold text-grey-500 mb-1"
          >
            Theme Color
          </label>

          <SelectTheme
            defaultValue={theme}
            data={getThemeOptions}
            onSelect={(value: string) => setValue("theme", value)}
          />

          {errors.theme && (
            <ErrorMessage id="theme-error" message={errors.theme.message} />
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
