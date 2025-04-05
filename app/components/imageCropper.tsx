"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
  Crop,
} from "react-image-crop";
import setCanvasPreview from "./setCanvasPreview";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

interface ImageCropperProps {
  closeModal: () => void;
  updateAvatar: (imageDataUrl: string) => void;
  previewImage: string;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  closeModal,
  updateAvatar,
  previewImage,
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [crop, setCrop] = useState<Crop | undefined>();

  const onImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    console.log("on ImageLoad");
    const { width, height } = event.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const initialCrop: Crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height,
    );

    const centeredCrop = centerCrop(
      { ...initialCrop, unit: "%" }, // Ensure the unit is "%"
      width,
      height,
    );

    setCrop(centeredCrop);
  };

  // const [imageSrc, setImageSrc] = useState(null);
  // const [croppedImage, setCroppedImage] = useState(null);

  // console.log({croppedImage});

  const getCroppedImage = async (croppedImage: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    if (!previewImage || !croppedImage) return;

    const image = new Image();

    image.src = previewImage;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = croppedImage.width;
    canvas.height = croppedImage.height;

    ctx.drawImage(
      image,
      croppedImage.x,
      croppedImage.y,
      croppedImage.width,
      croppedImage.height,
      0,
      0,
      croppedImage.width,
      croppedImage.height,
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const handleCropImage = async () => {
    console.log("handleCropImage");
    if (!imgRef.current || !previewCanvasRef.current || !crop) return;
    setCanvasPreview(
      imgRef.current, // HTMLImageElement
      previewCanvasRef.current, // HTMLCanvasElement
      convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height),
    );

    // setCroppedImage(convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height))
    const dataUrl = previewCanvasRef.current.toDataURL();

    updateAvatar(dataUrl);
    const croppedBlob = await getCroppedImage(
      convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height),
    );

    closeModal();
  };

  return (
    <div className="mt-4 p-4">
      {previewImage && (
        <div className="flex flex-col items-center">
          <ReactCrop
            keepSelection
            aspect={ASPECT_RATIO}
            crop={crop}
            minWidth={MIN_DIMENSION}
            onChange={(percentCrop) => setCrop(percentCrop)}
          >
            <Image
              ref={imgRef}
              alt="Upload"
              height={500} // Adjust height as needed
              src={previewImage}
              style={{ maxHeight: "70vh" }}
              width={500} // Adjust width as needed
              onLoad={onImageLoad}
            />
          </ReactCrop>
          <button
            className="text-white font-mono text-xs py-2 px-4 rounded-2xl mt-4 bg-sky-500 hover:bg-sky-600"
            type="button"
            onClick={handleCropImage}
          >
            Crop Image
          </button>
        </div>
      )}
      {crop && (
        <canvas
          ref={previewCanvasRef}
          className="mt-4"
          style={{
            display: "none",
            border: "1px solid black",
            objectFit: "contain",
            width: 150,
            height: 150,
          }}
        />
      )}
    </div>
  );
};

export default ImageCropper;
