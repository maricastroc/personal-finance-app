import { PotProps } from "@/types/pot";
import { ThemeDataProps, useThemeData } from "@/hooks/useThemesData";
import { SelectTheme } from "@/components/shared/SelectTheme";
import { useAppContext } from "@/contexts/AppContext";

interface PotThemeSelectorProps {
  pots: PotProps[] | undefined;
  pot: PotProps | undefined;
  onSelect: (themeId: string) => void;
}

export function PotThemeSelector({
  pots,
  pot,
  onSelect,
}: PotThemeSelectorProps) {
  const { themes } = useAppContext();

  const data: ThemeDataProps[] = useThemeData(themes, pots);

  return (
    <SelectTheme data={data} defaultValue={pot?.themeId} onSelect={onSelect} />
  );
}
