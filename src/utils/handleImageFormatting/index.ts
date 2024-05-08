import { RefObject } from "react";

const CANVAS_PADDING = 20;
let horizontalTextPosition = "";
let verticalTextPosition = "";

const findLongestString = (strings: string[]): string => {
  if (strings.length === 0) {
    return "";
  }

  let longest = strings[0];
  for (let i = 1; i < strings.length; i++) {
    if (strings[i].length > longest.length) {
      longest = strings[i];
    }
  }

  return longest;
};

const initializeImageAndCanvasProperties = (
  canvasRef: RefObject<HTMLCanvasElement>
) => {
  const image = document.createElement("img");
  const canvas = canvasRef.current;

  if (!canvas) return { image, ctx: null, canvas };

  const ctx = canvas.getContext("2d");

  return { image, ctx, canvas };
};

const getTextPositions = ({
  textPositionX,
  textPositionY,
  textWidth,
  canvas,
  textVerticalHeight,
  lines,
  ctx,
}: {
  textPositionX: string;
  textPositionY: string;
  textWidth: number;
  canvas: HTMLCanvasElement;
  textVerticalHeight: number;
  lines: string[];
  ctx: CanvasRenderingContext2D;
}) => {
  console.log("getTextPositions");

  switch (textPositionX) {
    case "left":
      horizontalTextPosition = String(0 + CANVAS_PADDING);
      break;
    case "right":
      horizontalTextPosition = String(
        canvas.offsetWidth -
          ctx.measureText(findLongestString(lines)).width -
          CANVAS_PADDING
      );
      break;
    case "center":
      horizontalTextPosition = String(
        canvas.offsetWidth / 2 -
          ctx.measureText(findLongestString(lines)).width / 2
      );
      break;
  }

  switch (textPositionY) {
    case "top":
      verticalTextPosition = String(textVerticalHeight + CANVAS_PADDING);
      break;
    case "bottom":
      verticalTextPosition = String(
        canvas.offsetHeight - CANVAS_PADDING * lines.length
      );
      break;
    case "center":
      verticalTextPosition = String(canvas.offsetHeight / 2);
      break;
  }

  return { horizontalTextPosition, verticalTextPosition };
};

const breakTextIntoNewLines = (
  text: string,
  ctx: CanvasRenderingContext2D,
  maxWidth: number
) => {
  let words = text.split(" ");
  let line = "";
  let lines = [];

  for (let i = 0; i < words.length; i++) {
    console.log("breakTextIntoNewLines");
    let testLine = line + words[i] + " ";
    let metrics = ctx.measureText(testLine);
    let minimumTextWidth = metrics.width;

    const isTextBeyondCanvasBoundary = minimumTextWidth > maxWidth;

    if (isTextBeyondCanvasBoundary) {
      lines.push(line);
      line = words[i] + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  return { lines };
};

const drawTextOnCanvas = ({
  textPositionX,
  textPositionY,
  text,
  fontSize,
  textColor,
  ctx,
  canvas,
}: {
  text: string;
  textPositionX: string;
  textPositionY: string;
  textColor: string;
  fontSize: number;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
}) => {
  ctx.fillStyle = textColor;
  ctx.font = `${fontSize}px Arial`;

  const minimumFontSize = 14;
  const maxWidth = canvas.width - 2 * CANVAS_PADDING;
  const { lines } = breakTextIntoNewLines(text, ctx, maxWidth);
  const textMetrics = ctx.measureText(text);
  let textWidth = textMetrics.width;
  const textVerticalHeight = textMetrics.actualBoundingBoxDescent;

  lines.forEach((line, index) => {
    console.log("drawTextOnCanvas");

    while (textWidth > maxWidth && fontSize > minimumFontSize) {
      fontSize--;
      ctx.font = `${fontSize}px Arial`;
      textWidth = ctx.measureText(text).width;
      console.log("while drawTextOnCanvas");
    }

    ctx.fillText(
      line,
      parseInt(
        getTextPositions({
          textPositionX,
          textPositionY,
          canvas,
          textWidth,
          textVerticalHeight,
          ctx,
          lines,
        }).horizontalTextPosition
      ),
      parseInt(
        getTextPositions({
          textPositionX,
          textPositionY,
          textVerticalHeight,
          textWidth,
          lines,
          ctx,
          canvas,
        }).verticalTextPosition
      ) +
        index * fontSize
    );
  });
};

export const handleTextOnImageFormatting = ({
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
  const { image, ctx, canvas } = initializeImageAndCanvasProperties(canvasRef);

  const isCanvasContextExist = ctx && true;

  if (!isCanvasContextExist) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  image.onload = () => {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    drawTextOnCanvas({
      textPositionX,
      textPositionY,
      text,
      textColor,
      fontSize,
      ctx,
      canvas,
    });
  };
  image.src = templatePath;
  image.crossOrigin = "anonymous";
};

export const handleImageDownload = (
  canvasRef: RefObject<HTMLCanvasElement>
) => {
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
