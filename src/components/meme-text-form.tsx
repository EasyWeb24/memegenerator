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

const formSchema = z.object({
  text: z.string(),
  textPositionX: z.string(),
  textPositionY: z.string(),
  templatePath: z.string(),
  textColor: z.string(),
  fontSize: z.coerce.number(),
});

const handleImage = ({
  templatePath,
  text,
  canvasRef,
  textColor,
  textPositionX,
  fontSize,
  textPositionY,
}: {
  templatePath: string;
  text: string;
  canvasRef: RefObject<HTMLCanvasElement>;
  textColor: string;
  textPositionX: string;
  textPositionY: string;
  fontSize: number;
}) => {
  const image = document.createElement("img");
  const canvas = canvasRef.current;
  let horizontalTextPosition = "";
  let verticalTextPosition = "";
  const canvasPadding = 20; // Adjust the padding value as needed

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const textMetrics = ctx.measureText(text);

  const getPositions = ({
    textPositionX,
    textPositionY,
    textMetrics,
  }: {
    textPositionX: string;
    textPositionY: string;
    textMetrics: TextMetrics;
  }) => {
    switch (textPositionX) {
      case "left":
        horizontalTextPosition = String(0 + canvasPadding);
        break;
      case "right":
        horizontalTextPosition = String(
          canvas.offsetWidth - textMetrics.width - canvasPadding
        );
        break;
      case "center":
        horizontalTextPosition = String(
          canvas.offsetWidth / 2 - textMetrics.width / 2
        );
        break;
    }

    switch (textPositionY) {
      case "top":
        verticalTextPosition = String(
          textMetrics.actualBoundingBoxAscent + canvasPadding
        );
        break;
      case "bottom":
        verticalTextPosition = String(canvas.offsetHeight - canvasPadding);
        break;
      case "center":
        verticalTextPosition = String(canvas.offsetHeight / 2);
        break;
    }

    return { horizontalTextPosition, verticalTextPosition };
  };

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  image.onload = () => {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    let textWidth = ctx.measureText(text).width;

    // Draw the text
    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px Arial`;

    const minWidth = 14; // Minimum font size
    const maxWidth = canvas.width - 2 * canvasPadding;

    let words = text.split(" ");
    let line = "";
    let lines = [];

    for (let i = 0; i < words.length; i++) {
      let testLine = line + words[i] + " ";
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth) {
        lines.push(line);
        line = words[i] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    console.log({
      horizontalTextPosition: getPositions({
        textPositionX,
        textPositionY,
        textMetrics: textMetrics,
      }).horizontalTextPosition,
      verticalTextPosition: getPositions({
        textPositionX,
        textPositionY,
        textMetrics: textMetrics,
      }).verticalTextPosition,
    });

    // Draw each line of text
    lines.forEach((line, index) => {
      while (textWidth > maxWidth && fontSize > minWidth) {
        fontSize--;
        ctx.font = `${fontSize}px Arial`;
        textWidth = ctx.measureText(text).width;
      }

      ctx.fillText(
        line,
        parseInt(
          getPositions({
            textPositionX,
            textPositionY,
            textMetrics: textMetrics,
          }).horizontalTextPosition
        ),
        parseInt(
          getPositions({
            textPositionX,
            textPositionY,
            textMetrics: textMetrics,
          }).verticalTextPosition
        ) +
          index * fontSize
      ); // Assuming 30px line height
    });
  };
  image.src = templatePath;
};

const MemeTextForm = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [templatePath, setTemplatePath] = useState<string>("");

  const [isImageSubmitted, setIsImageSubmitted] = useState<boolean | undefined>(
    false
  );

  const handleDownload = () => {
    const canvas = (canvasRef as RefObject<HTMLCanvasElement>).current;

    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "meme.png"; // Set the filename for the downloaded image
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fontSize: 30,
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

    handleImage({ ...data, canvasRef });
  };

  useEffect(() => {
    form.register("templatePath");
    templatePath && form.setValue("templatePath", templatePath);
  }, [templatePath, form]);

  return (
    <>
      <ImageUploader
        handleDownload={handleDownload}
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
                  <Input placeholder="Text Color" type="color" {...field} />
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
