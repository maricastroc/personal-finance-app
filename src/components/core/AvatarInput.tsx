import { AVATAR_URL_DEFAULT } from "@/utils/constants";
import { Pencil, User } from "phosphor-react";

interface AvatarInputProps {
  avatarPreview: string | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputFileRef: React.RefObject<HTMLInputElement>;
}

export const AvatarInput = ({
  avatarPreview,
  onChange,
  inputFileRef,
}: AvatarInputProps) => {
  return (
    <div className="flex flex-col w-full sm:mb-4 overflow-hidden sm:grid sm:grid-cols-[1fr,3.6fr] items-center gap-4">
      <div className="flex items-center justify-center border-2 border-grey-300 rounded-full w-30 h-30">
        <div className="flex items-center justify-center relative h-[6.5rem] min-w-[6.5rem]">
          {avatarPreview ? (
            <img
              src={avatarPreview || AVATAR_URL_DEFAULT}
              alt="Selected avatar"
              className="rounded-full h-[6.5rem] w-[6.5rem]"
            />
          ) : (
            <User className="w-16 h-16 text-grey-500" aria-hidden="true" />
          )}

          <button
            type="button"
            aria-label="Select new avatar"
            onClick={() => inputFileRef.current?.click()}
            className="absolute hover:bg-grey-500 focus:ring-2 focus:ring-medium-purple cursor-pointer top-[73%] left-[72%] flex items-center justify-center bg-grey-900 border border-grey-500 rounded-full text-white w-[2.2rem] h-[2.2rem] sm:left-[68%]"
          >
            <Pencil size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-grow w-full">
        <label
          htmlFor="avatar"
          className="text-xs font-bold text-grey-500 mb-1 cursor-pointer"
        >
          Avatar
        </label>

        <div className="overflow-hidden flex-grow-0 truncate flex h-12 flex-col text-sm w-full rounded-md border border-beige-500 px-3 items-start justify-center">
          <input
            id="avatar"
            type="file"
            ref={inputFileRef}
            onChange={onChange}
            className="hidden"
          />
          <span className="truncate max-w-[15rem]">
            {avatarPreview ? "Selected avatar" : "No file selected."}
          </span>
        </div>
      </div>
    </div>
  );
};
