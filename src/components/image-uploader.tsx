"use client";
 
import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "./ui/button";
 
export default function ImageUploader({setTemplatePath, templatePath}:{setTemplatePath:Dispatch<SetStateAction<string>>, templatePath:string}) {

if (templatePath) return <>
    <Image alt="Meme template" src={templatePath} width={400} height={500}/>
    <Button variant={'destructive'} onClick={() => setTemplatePath('')} >
Cancel
    </Button>

</>

  return (
    <>
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          setTemplatePath(res[0].url)
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />

     
    </>
  );
}