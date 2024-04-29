"use client";
 
import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";
import { useState } from "react";
 
export default function ImageUploader() {
const [imageURL, setImageURL] = useState<string>()

  return (
    <>
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
        setImageURL(res[0].url)
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />

      {
      imageURL && <Image alt="Meme template" src={imageURL} width={400} height={500}/>
      }
    </>
  );
}