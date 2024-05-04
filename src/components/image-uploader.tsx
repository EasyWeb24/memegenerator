"use client";

import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";
import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { Button } from "./ui/button";

export default function ImageUploader({
  setTemplatePath,
  templatePath,
  handleDownload,
  canvasRef,
  setIsImageSubmitted,
  isImageSubmitted,
}: {
  canvasRef: RefObject<HTMLCanvasElement>;
  setTemplatePath: Dispatch<SetStateAction<string>>;
  templatePath: string;
  handleDownload: () => void;
  setIsImageSubmitted: Dispatch<SetStateAction<boolean | undefined>>;
  isImageSubmitted: boolean | undefined;
}) {
  if (templatePath && !isImageSubmitted)
    return (
      <div className="mt-4">
        <Image
          alt="Meme template"
          src={templatePath}
          width={400}
          height={500}
        />
      </div>
    );

  if (templatePath)
    return (
      <div className="mt-4">
        <canvas ref={canvasRef} width={500} height={500} />{" "}
        <div className="mt-4 flex gap-3">
          <Button variant={"destructive"} onClick={() => setTemplatePath("")}>
            Cancel
          </Button>
          <Button onClick={handleDownload}>Download Image</Button>
        </div>
      </div>
    );

  return (
    <>
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          setTemplatePath(res[0].url);
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </>
  );
}
