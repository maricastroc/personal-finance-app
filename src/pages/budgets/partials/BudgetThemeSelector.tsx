import { BudgetProps } from "@/types/budget";
import { ThemeDataProps, useThemeData } from "@/hooks/useThemesData";
import { SelectTheme } from "@/components/shared/SelectTheme";
import { useAppContext } from "@/contexts/AppContext";

interface BudgetThemeSelectorProps {
  budgets: BudgetProps[] | undefined;
  budget: BudgetProps | undefined;
  onSelect: (themeId: string) => void;
}

export function BudgetThemeSelector({
  budgets,
  budget,
  onSelect,
}: BudgetThemeSelectorProps) {
  const { themes } = useAppContext();

  const data: ThemeDataProps[] = useThemeData(themes, budgets);

  return (
    <SelectTheme
      data={data}
      defaultValue={budget?.theme.id}
      onSelect={onSelect}
    />
  );
}
