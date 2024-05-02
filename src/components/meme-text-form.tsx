"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RefObject, useEffect, useRef, useState } from "react"
import ImageUploader from "./image-uploader"





const formSchema = z.object({
  text: z.string(),
  textPositionX:z.coerce.number(),
  textPositionY:z.coerce.number(),
  templatePath:z.string(),
  textColor:z.string()

})

const handleImage = ({templatePath, text, canvasRef, textColor}:{templatePath:string, text:string, canvasRef:RefObject<HTMLCanvasElement>, textColor:string}) => {


  const image = document.createElement('img')
  const canvas = canvasRef.current;

if (!canvas) return

  const ctx = canvas.getContext('2d');

  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  image.onload = () => {
   ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
 
   // Draw the text
   ctx.fillStyle = textColor;
   ctx.font = '30px Arial';
   ctx.textAlign = 'center';
   ctx.fillText(text, 50, 50);
 };
 image.src = templatePath;
 
 }


const MemeTextForm = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [templatePath, setTemplatePath] = useState<string>('')

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
      })

      const onSubmit = async( data : {text:string,textColor:string, templatePath:string, textPositionX:number, textPositionY:number}) => {
handleImage({...data, canvasRef})
    }

      useEffect(()=>{
        form.register('templatePath')
        templatePath && form.setValue('templatePath', templatePath)
    }, [templatePath, form])

  return (
  <>
  <ImageUploader setTemplatePath={setTemplatePath} templatePath={templatePath} />

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text</FormLabel>
              <FormControl>
                <Input placeholder="Text" {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="textColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text Color</FormLabel>
              <FormControl>
                <Input placeholder="Text Color" type="color" {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="textPositionX"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text Position X</FormLabel>
              <FormControl>
                <Input placeholder="Text Position X" {...field} type="number" />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="textPositionY"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text Position Y</FormLabel>
              <FormControl>
                <Input placeholder="Text Position Y" {...field} type="number"/>
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
       
        <Button type="submit">Submit</Button>
      </form>
    </Form>
 { templatePath &&  <canvas
        ref={canvasRef}
        width={500}
        height={500}
        style={{ border: '1px solid black' }}
      />}
  </>
  
  )
}

export default MemeTextForm