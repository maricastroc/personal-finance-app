import { PotProps } from "@/types/pot";
import { ThemeProps } from "@/types/theme";
import { useMemo } from "react";

export interface ThemeDataProps {
  label: React.ReactNode;
  value: string | number;
  disabled?: boolean;
}

export function useThemeData(
  themes: ThemeProps[] | undefined,
  pots: PotProps[] | undefined
): ThemeDataProps[] {
  return useMemo(() => {
    const usedThemeIds = new Set(pots?.map((p) => p.themeId));

    if (!themes || !pots) {
      return [];
    }

    const available = themes.filter((t) => !usedThemeIds.has(t.id));
    const unavailable = themes.filter((t) => usedThemeIds.has(t.id));

    return [
      ...available.map((t) => ({
        value: t.id,
        label: (
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: t.color }}
            />
            {t.description}
          </div>
        ),
      })),

      ...unavailable.map((t) => ({
        value: t.id,
        disabled: true,
        label: (
          <div className="flex items-center gap-2 opacity-50">
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: t.color }}
            />
            {t.description}
          </div>
        ),
      })),
    ];
  }, [themes, pots]);
}
