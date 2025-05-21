import { AVATAR_URL_DEFAULT } from '@/utils/constants'
import { Pencil, User } from 'phosphor-react'

interface AvatarInputProps {
  avatarPreview: string | null
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  inputFileRef: React.RefObject<HTMLInputElement>
}

export const AvatarInput = ({
  avatarPreview,
  onChange,
  inputFileRef,
}: AvatarInputProps) => {
  return (
    <div className="flex flex-col w-full sm:mb-4 overflow-hidden sm:grid sm:grid-cols-[1fr,3.6fr] items-center gap-4">
      <div className="flex  items-center justify-center border-2 border-gray-300 rounded-full w-30 h-30">
        <div className="flex items-center justify-center relative h-[6.5rem] min-w-[6.5rem]">
          {avatarPreview ? (
            <img
              src={avatarPreview || AVATAR_URL_DEFAULT}
              alt="Avatar Preview"
              className="rounded-full h-[6.5rem] w-[6.5rem]"
            />
          ) : (
            <User className="w-16 h-16 text-gray-500" />
          )}
          <button
            type="button"
            onClick={() => inputFileRef.current?.click()}
            className="absolute hover:bg-gray-500 cursor-pointer top-[73%] left-[72%] flex items-center justify-center bg-gray-900 border border-gray-500 rounded-full text-gray-100 w-[1.9rem] h-[1.9rem] sm:left-[68%]"
          >
            <Pencil size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-grow w-full">
        <label className="text-xs font-bold text-gray-500 mb-1">Avatar</label>
        <div className="overflow-hidden flex-grow-0 truncate flex h-12 flex-col text-sm w-full rounded-md border border-beige-500 px-3 items-start justify-center">
          <input
            type="file"
            ref={inputFileRef}
            style={{ display: 'none' }}
            onChange={onChange}
            className="truncate overflow-hidden w-full"
          />
          <span className="truncate max-w-[15rem]">
            {avatarPreview || 'No file selected'}
          </span>
        </div>
      </div>
    </div>
  )
}
