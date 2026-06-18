export const ErrorMessage = ({
  id,
  message,
}: {
  id: string | undefined;
  message: string | undefined;
}) => (
  <span id={id} className="mt-1 text-accent-red font-semibold text-xs">
    {message}
  </span>
);
