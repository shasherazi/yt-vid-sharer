"use client";

import Image from "next/image";
import satori from "satori";

export default function YTImage() {
  const res = fetch("https://example.com/path-to-arial-font.ttf");
  const fontData = res.then((res) =>
    res.arrayBuffer(),
  ) as unknown as ArrayBuffer;

  const svgPromise = satori(
    <div style={{ color: "black" }}>hello, world</div>,
    {
      width: 600,
      height: 400,
      fonts: [
        {
          name: "Arial",
          data: fontData,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );

  const svg = svgPromise as unknown as string;

  return (
    <div>
      <Image
        src={`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`}
        alt="Generated Image"
        width={600}
        height={400}
      />
    </div>
  );
}
