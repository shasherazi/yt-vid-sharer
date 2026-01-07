"use client";

import { useState } from "react";
import Form from "./components/form";
import YTImage from "./components/yt_image";

interface FormResponse {
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

export default function Home() {
  const [formResponse, setFormResponse] = useState<FormResponse | null>(null);

  const handleFormResponse = (data: FormResponse) => {
    setFormResponse(data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-10 md:mt-14 lg:mt-20">
        YouTube Video Sharer
      </h1>

      <Form onResponse={handleFormResponse} />

      {formResponse && <YTImage {...(formResponse as FormResponse)} />}
    </div>
  );
}
