/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect } from 'react'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import { PrimaryButton } from '../core/PrimaryButton'

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
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeButtonRef.current?.focus()

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

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
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cropper-title"
    >
      <div className="flex flex-col justify-center items-center min-w-[80vw] md:min-w-[55vw] p-4 bg-white w-auto lg:min-w-[30rem] max-w-[30rem] rounded-lg shadow-xl">
        <h2 id="cropper-title" className="sr-only">
          Crop your image
        </h2>

        <Cropper
          src={src}
          style={{ height: 400, width: '100%' }}
          initialAspectRatio={aspectRatio}
          aspectRatio={aspectRatio}
          guides={true}
          ref={cropperRef}
        />

        <div className="flex w-full justify-center gap-2 mt-4">
          <PrimaryButton
            ref={closeButtonRef}
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </PrimaryButton>

          <PrimaryButton onClick={handleCrop}>Crop Image</PrimaryButton>
        </div>
      </div>
    </div>
  )
}
