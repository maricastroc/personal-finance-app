import { PotProps } from "./pot";

export interface PotsResult {
  pots: PotProps[];
  totalCurrentAmount: number | undefined;
}
