import React, { useState, useRef, FC } from 'react'

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from 'react-image-crop'
import { canvasPreview } from './canvasPreview'
import { useDebounceEffect } from './useDebounceEffects';
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../api/store";

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input
  } from "@heroui/react";

import 'react-image-crop/dist/ReactCrop.css';

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

interface ImageUploaderProps {
  userId: string;
}

const ImageUploader: FC<ImageUploaderProps> = ({ userId }) => {
  
  const [imgSrc, setImgSrc] = useState('')
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const hiddenAnchorRef = useRef<HTMLAnchorElement>(null)
  const blobUrlRef = useRef('')
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [aspect, setAspect] = useState<number | undefined>(4 / 3)

  const {isOpen, onOpen, onOpenChange ,onClose} = useDisclosure();

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || ''),
      )
      reader.readAsDataURL(e.target.files[0])
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }

  const dispatch = useDispatch<AppDispatch>();

  async function onDownloadCropClick() {
    const image = imgRef.current
    const previewCanvas = previewCanvasRef.current
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error('Crop canvas does not exist')
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    )
    const ctx = offscreen.getContext('2d')
    if (!ctx) {
      throw new Error('No 2d context')
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height,
    )
    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: 'image/png',
    })

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
    }
    blobUrlRef.current = URL.createObjectURL(blob)


    const formData = new FormData();
    formData.append("photo", blob, "photo.png"); // Add the blob with a filename

    dispatch({
      type: "apiRequest",
      payload: {
        url: `user/upload-photo`,
        method: "POST",
        onSuccess: "users/uploadProfilePhoto",
        onError: "GLOBAL_MESSAGE",
        dispatchType: "uploadProfilePhoto",
        body: formData,
        params: { userId },
        headers: { "Content-Type": "multipart/form-data" },
      },
    });

    // if (hiddenAnchorRef.current) {
    //   hiddenAnchorRef.current.href = blobUrlRef.current
    //   console.log('hiddenAnchorRef.current', hiddenAnchorRef.current);
    //   hiddenAnchorRef.current.click()
    // }

    // Modal Close
    onClose();

  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate,
        )
      }
    },
    100,
    [completedCrop, scale, rotate],
  )

  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined)
    } else {
      setAspect(4 / 3)

      if (imgRef.current) {
        const { width, height } = imgRef.current
        const newCrop = centerAspectCrop(width, height, 4 / 3)
        setCrop(newCrop)
        // Updates the preview
        setCompletedCrop(convertToPixelCrop(newCrop, width, height))
      }
    }
  }

  return (
    <div className="App">
        <Button
            className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg text-xs h-6"
            radius="full"
            onPress={onOpen}
            size='sm'
        >
            Edit
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1">Profile picture</ModalHeader>
                        <ModalBody>
                        <div className="Crop-Controls">
                            <Input type="file" accept="image/*" onChange={onSelectFile} />
                            {/* <div>
                            <label htmlFor="scale-input">Scale: </label>
                            <input
                                id="scale-input"
                                type="number"
                                step="0.1"
                                value={scale}
                                disabled={!imgSrc}
                                onChange={(e) => setScale(Number(e.target.value))}
                            />
                            </div>
                            <div>
                            <label htmlFor="rotate-input">Rotate: </label>
                            <input
                                id="rotate-input"
                                type="number"
                                value={rotate}
                                disabled={!imgSrc}
                                onChange={(e) =>
                                setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))
                                }
                            />
                            </div>
                            <div>
                            <button onClick={handleToggleAspectClick}>
                                Toggle aspect {aspect ? 'off' : 'on'}
                            </button> 
                            </div> */}
                        </div>
                        {!!imgSrc && (
                            <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspect}
                            // minWidth={400}
                            minHeight={100}
                            // circularCrop
                            >
                            <img
                                ref={imgRef}
                                alt="Crop me"
                                src={imgSrc}
                                style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                                onLoad={onImageLoad}
                            />
                            </ReactCrop>
                        )}
                        {!!completedCrop && (
                            <>
                            <div>
                                <canvas
                                ref={previewCanvasRef}
                                style={{
                                    border: '1px solid black',
                                    objectFit: 'contain',
                                    width: 0,
                                    height: 0,
                                    visibility: "hidden"
                                }}
                                />
                            </div>
                            <div>
                                <Button color='primary' onClick={onDownloadCropClick}>Upload</Button>
                                <a
                                  href="#hidden"
                                  ref={hiddenAnchorRef}
                                  download
                                  style={{
                                      position: 'absolute',
                                      top: '-200vh',
                                      visibility: 'hidden',
                                  }}
                                >
                                  Hidden download
                                </a>
                            </div>
                            </>
                        )}
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    </div>
  )
}

export default ImageUploader;
