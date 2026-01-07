"use client";

import { useEffect, useRef } from "react";

interface YTImageProps {
  title: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  channelTitle: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
    standard?: { url: string; width: number; height: number };
    maxres?: { url: string; width: number; height: number };
  };
  channelThumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
  };
}

export default function YTImage(props: YTImageProps) {
  const thumbnailUrl = props.thumbnails.high.url;
  const avatarUrl = props.channelThumbnails.default.url;
  const qrUrl = "https://i.ibb.co/Z6HsRjsF/qr-code.png";

  const title = props.title;
  const channelName = props.channelTitle;
  const views = props.viewCount;
  const publishedAt = props.publishedAt;
  const duration = props.duration;

  const fonts = {
    mono: "/assets/fonts/RobotoMono-Bold.ttf",
    regular: "/assets/fonts/Roboto-Regular.ttf",
    semiBold: "/assets/fonts/Roboto-SemiBold.ttf",
  };

  const layout = {
    width: 1080,
    height: 1014,
    thumbnail: {
      x: 0,
      y: 0,
      width: 1080,
      height: 608,
    },
    duration: {
      x: 932, // This will be recalculated to align right
      y: 534,
      width: 128,
      height: 54,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      borderRadius: 10,
      paddingX: 16, // Horizontal padding for the text
      text: {
        x: 953,
        y: 538,
        width: 86,
        height: 47,
        fontFamily: "CustomRobotoMono",
        fontSize: 36,
        fontWeight: "bold",
        color: "#ffffff",
      },
    },
    title: {
      x: 136,
      y: 628,
      width: 924,
      lineHeight: 60, // Defined line height for shifting logic
      fontFamily: "CustomRobotoSemiBold",
      fontSize: 48,
      fontWeight: "500",
      color: "#000000",
    },
    avatar: {
      x: 20,
      y: 628,
      width: 96,
      height: 96,
      borderRadius: 48,
    },
    channelName: {
      x: 136,
      y: 704, // Base position for 1-line title
      color: "#606060",
      fontFamily: "CustomRobotoRegular",
      fontSize: 32,
      fontWeight: "400",
    },
    views: {
      x: 136,
      y: 757,
      color: "#606060",
      fontFamily: "CustomRobotoRegular",
      fontSize: 32,
      fontWeight: "400",
    },
    publishedAt: {
      x: 136,
      y: 810,
      color: "#606060",
      fontFamily: "CustomRobotoRegular",
      fontSize: 32,
      fontWeight: "400",
    },
    qrcode: {
      x: 820,
      y: 754,
      width: 240,
      height: 240,
    },
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // important for canvas export security
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
      });
    };

    const loadFont = async (name: string, url: string) => {
      const font = new FontFace(name, `url(${url})`);
      await font.load();
      document.fonts.add(font);
      return name;
    };

    const drawCanvas = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      try {
        const [thumbnailImg, avatarImg, qrImg] = await Promise.all([
          loadImage(thumbnailUrl),
          loadImage(avatarUrl),
          loadImage(qrUrl),
          loadFont("CustomRobotoMono", fonts.mono),
          loadFont("CustomRobotoRegular", fonts.regular),
          loadFont("CustomRobotoSemiBold", fonts.semiBold),
        ]);

        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(
          thumbnailImg,
          layout.thumbnail.x,
          layout.thumbnail.y,
          layout.thumbnail.width,
          layout.thumbnail.height,
        );

        // duration
        const durationText = duration;
        ctx.font = `${layout.duration.text.fontWeight} ${layout.duration.text.fontSize}px ${layout.duration.text.fontFamily}`;

        const durationMetrics = ctx.measureText(durationText);
        const durationBgWidth =
          durationMetrics.width + layout.duration.paddingX * 2;

        // Calculate X to keep it aligned to the right side of the visual area
        // Original X (932) + Original Width (128) = 1060 (right edge roughly)
        // Let's anchor it to the original right edge
        const rightEdge = 932 + 128;
        const durationX = rightEdge - durationBgWidth;

        ctx.fillStyle = layout.duration.backgroundColor;
        ctx.beginPath();
        ctx.roundRect(
          durationX,
          layout.duration.y,
          durationBgWidth,
          layout.duration.height,
          layout.duration.borderRadius,
        );
        ctx.fill();

        ctx.fillStyle = layout.duration.text.color;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(
          durationFormat(durationText),
          durationX + durationBgWidth / 2,
          layout.duration.y + layout.duration.height / 2 + 2, // +2 for visual vertical centering
        );

        // avatar
        ctx.save();
        ctx.beginPath();
        ctx.arc(
          layout.avatar.x + layout.avatar.borderRadius,
          layout.avatar.y + layout.avatar.borderRadius,
          layout.avatar.borderRadius,
          0,
          Math.PI * 2,
        );
        ctx.closePath();
        ctx.clip(); // clip to the circle

        ctx.drawImage(
          avatarImg,
          layout.avatar.x,
          layout.avatar.y,
          layout.avatar.width,
          layout.avatar.height,
        );
        ctx.restore(); // restore to remove clipping

        // title
        ctx.fillStyle = layout.title.color;
        ctx.font = `${layout.title.fontWeight} ${layout.title.fontSize}px ${layout.title.fontFamily}`;
        ctx.textBaseline = "top";
        ctx.textAlign = "left";

        const linesUsed = drawTitleWithEllipsis(
          ctx,
          title,
          layout.title.x,
          layout.title.y,
          layout.title.width,
          layout.title.lineHeight,
          2, // Max lines
        );

        const metaOffset = linesUsed > 1 ? layout.title.lineHeight : 0;

        // channel name
        ctx.fillStyle = layout.channelName.color;
        ctx.font = `${layout.channelName.fontWeight} ${layout.channelName.fontSize}px ${layout.channelName.fontFamily}`;
        ctx.fillText(
          channelName,
          layout.channelName.x,
          layout.channelName.y + metaOffset,
        );

        // views
        ctx.fillStyle = layout.views.color;
        ctx.font = `${layout.views.fontWeight} ${layout.views.fontSize}px ${layout.views.fontFamily}`;
        ctx.fillText(
          viewsFormat(views),
          layout.views.x,
          layout.views.y + metaOffset,
        );

        // published at
        ctx.fillStyle = layout.publishedAt.color;
        ctx.font = `${layout.publishedAt.fontWeight} ${layout.publishedAt.fontSize}px ${layout.publishedAt.fontFamily}`;
        ctx.fillText(
          publishedAtFormat(publishedAt),
          layout.publishedAt.x,
          layout.publishedAt.y + metaOffset,
        );

        // qrcode
        ctx.drawImage(
          qrImg,
          layout.qrcode.x,
          layout.qrcode.y,
          layout.qrcode.width,
          layout.qrcode.height,
        );
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    drawCanvas();
  }, []);

  return (
    <div className="mt-6">
      <canvas ref={canvasRef} width={layout.width} height={layout.height} />
    </div>
  );
}

// --- Helper: Draw Text with Wrapping & Ellipsis ---
// Returns the number of lines drawn (1 or 2)
function drawTitleWithEllipsis(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
): number {
  const words = text.split(" ");
  let line = "";
  let currentLineIdx = 0;

  for (let n = 0; n < words.length; n++) {
    const testline = line + words[n] + " ";
    const metrics = ctx.measureText(testline);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      // if exceeds width and not first word
      if (currentLineIdx + 1 === maxLines) {
        // last allowed line, add ellipsis
        let lastline = line.trim();
        while (
          ctx.measureText(lastline + "...").width > maxWidth &&
          lastline.length > 0
        ) {
          lastline = lastline.slice(0, -1);
        }
        ctx.fillText(lastline + "...", x, y + currentLineIdx * lineHeight);
        return maxLines;
      }

      // draw current line
      ctx.fillText(line, x, y + currentLineIdx * lineHeight);
      line = words[n] + " ";
      currentLineIdx++;
    } else {
      line = testline;
    }
  }

  // Draw remaining text
  ctx.fillText(line, x, y + currentLineIdx * lineHeight);

  return currentLineIdx + 1;
}

function viewsFormat(viewCount: string): string {
  const viewsNum = parseInt(viewCount, 10);
  if (viewsNum >= 1_000_000_000) {
    return (
      (viewsNum / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B views"
    );
  } else if (viewsNum >= 1_000_000) {
    return (viewsNum / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M views";
  } else if (viewsNum >= 1_000) {
    return (viewsNum / 1_000).toFixed(1).replace(/\.0$/, "") + "K views";
  } else if (viewsNum === 1) {
    return "1 view";
  } else {
    return viewsNum + " views";
  }
}

function publishedAtFormat(publishedAt: string): string {
  const publishedDate = new Date(publishedAt);
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - publishedDate.getTime()) / 1000,
  );

  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const interval in intervals) {
    const intervalSeconds = intervals[interval];
    const count = Math.floor(diffInSeconds / intervalSeconds);
    if (count >= 1) {
      return count + " " + interval + (count > 1 ? "s" : "") + " ago";
    }
  }
  return "just now";
}

function durationFormat(duration: string): string {
  // ISO 8601 duration format parsing
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";

  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  } else {
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
}
