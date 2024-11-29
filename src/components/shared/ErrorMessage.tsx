export const ErrorMessage = ({ message }: { message: string | undefined }) => (
  <span className="mt-1 text-secondary-red font-semibold text-xs">
    {message}
  </span>
)
