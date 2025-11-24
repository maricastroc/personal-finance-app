import { ThemeProps } from "@/types/theme";
import { PotProps } from "@/types/pot";
import { ThemeDataProps, useThemeData } from "@/hooks/useThemesData";
import { SelectTheme } from "@/components/shared/SelectTheme";

interface PotThemeSelectorProps {
  themes: ThemeProps[] | undefined;
  pots: PotProps[] | undefined;
  pot: PotProps | undefined;
  onSelect: (themeId: string) => void;
}

export function PotThemeSelector({
  themes,
  pots,
  pot,
  onSelect,
}: PotThemeSelectorProps) {
  const data: ThemeDataProps[] = useThemeData(themes, pots);

  return (
    <SelectTheme data={data} defaultValue={pot?.themeId} onSelect={onSelect} />
  );
}
