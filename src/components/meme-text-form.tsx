"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RefObject, useEffect, useRef, useState } from "react";
import ImageUploader from "./image-uploader";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  handleImageDownload,
  handleTextOnImageFormatting,
} from "@/utils/handleImageFormatting";

const formSchema = z.object({
  text: z.string(),
  textPositionX: z.string(),
  textPositionY: z.string(),
  templatePath: z.string(),
  textColor: z.string(),
  fontSize: z.coerce.number(),
});

const MemeTextForm = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [templatePath, setTemplatePath] = useState<string>("");
  const [isImageSubmitted, setIsImageSubmitted] = useState<boolean | undefined>(
    false
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fontSize: 30,
      textColor: "#000",
    },
  });

  const onSubmit = async (data: {
    text: string;
    textColor: string;
    templatePath: string;
    textPositionX: string;
    textPositionY: string;
    fontSize: number;
  }) => {
    setIsImageSubmitted(true);

    try {
      handleTextOnImageFormatting({ ...data, canvasRef });
    } catch (error) {
      console.warn((error as Error).message);
    }
  };

  useEffect(() => {
    form.register("templatePath");
    templatePath && form.setValue("templatePath", templatePath);
  }, [templatePath, form]);

  return (
    <>
      <ImageUploader
        handleImageDownload={handleImageDownload}
        setTemplatePath={setTemplatePath}
        canvasRef={canvasRef}
        templatePath={templatePath}
        setIsImageSubmitted={setIsImageSubmitted}
        isImageSubmitted={isImageSubmitted}
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-12 space-y-8"
        >
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
                  <Input
                    defaultValue={"#000"}
                    placeholder="Text Color"
                    type="color"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fontSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Font Size</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Font Size"
                    defaultValue={30}
                    type="number"
                    {...field}
                  />
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Text Position X</SelectLabel>
                        <SelectItem value={"left"}>Left</SelectItem>
                        <SelectItem value={"center"}>Center</SelectItem>
                        <SelectItem value={"right"}>Right</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Text Position Y</SelectLabel>
                        <SelectItem value={"top"}>Top</SelectItem>
                        <SelectItem value={"center"}>Center</SelectItem>
                        <SelectItem value={"bottom"}>Bottom</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
};

export default MemeTextForm;
