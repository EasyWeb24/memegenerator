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
import { useEffect, useState } from "react"
import ImageUploader from "./image-uploader"
import Image from "next/image"



const formSchema = z.object({
  topText: z.string(),
  bottomText: z.string(),
  templatePath:z.string()

})





const MemeTextForm = () => {
    const [templatePath, setTemplatePath] = useState<string>('')

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        
      })

      const onSubmit = async( data : {topText:string, bottomText:string, templatePath:string}) => {
       

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
          name="topText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Top Text</FormLabel>
              <FormControl>
                <Input placeholder="Top Text" {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bottomText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bottom Text</FormLabel>
              <FormControl>
                <Input placeholder="Top Text" {...field} />
              </FormControl>
         
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>

  </>
  
  )
}

export default MemeTextForm