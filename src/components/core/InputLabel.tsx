import { LabelHTMLAttributes } from "react";

export default function InputLabel({
  value,
  className = "",
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> & {
  value?: string;
}) {
  return (
    <label
      {...props}
      className={`text-xs font-bold text-grey-500 mb-1 ` + className}
    >
      {value || children}
    </label>
  );
}
