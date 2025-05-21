/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from 'react'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import { CustomButton } from '../core/CustomButton'

interface ImageCropperProps {
  src: string
  onCrop: (croppedImage: string) => void
  aspectRatio?: number
  onClose: () => void
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  onClose,
  src,
  onCrop,
  aspectRatio = 1,
}) => {
  const cropperRef = useRef<HTMLImageElement>(null)

  const [isCropping, setIsCropping] = useState(true)

  const handleCrop = () => {
    if (cropperRef.current) {
      const cropper = (cropperRef.current as any).cropper
      const croppedCanvas = cropper.getCroppedCanvas({
        width: 500,
        height: 500,
        minWidth: 256,
        minHeight: 256,
        maxWidth: 2048,
        maxHeight: 2048,
        fillColor: '#fff',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      })

      onCrop(croppedCanvas.toDataURL())
      setIsCropping(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="flex flex-col justify-center items-center min-w-[80vw] md:min-w-[55vw] md:w-auto p-4 bg-white w-auto lg:min-w-[30rem] max-w-[30rem] rounded-lg">
        {isCropping ? (
          <>
            <Cropper
              src={src}
              style={{
                height: 400,
                width: '100%',
              }}
              initialAspectRatio={aspectRatio}
              aspectRatio={aspectRatio}
              guides={true}
              ref={cropperRef}
            />
            <div className="flex w-full justify-center gap-2 mt-4">
              <CustomButton
                variant="outline"
                customContent={'Cancel'}
                customContentLoading={'Loading...'}
                onClick={() => {
                  setIsCropping(false)
                  onClose()
                }}
              />
              <CustomButton
                customContent={'Crop Image'}
                customContentLoading={'Loading...'}
                onClick={handleCrop}
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
