"use client";

import { useState } from "react";
import Form from "./components/form";
import YTImage from "./components/yt_image";
import Navbar from "./components/navbar";

interface FormResponse {
  id: string;
  title: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  channelTitle: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
    standard: { url: string; width: number; height: number };
    maxres: { url: string; width: number; height: number };
  };
  channelThumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
  };
  error?: string;
}

export default function Home() {
  const [formResponse, setFormResponse] = useState<FormResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null,
  );

  const handleIsLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const handleFormResponse = (data: FormResponse) => {
    setGeneratedImageUrl(null);
    setFormResponse(data);
  };

  const handleGeneratedImageUrl = (url: string) => {
    setGeneratedImageUrl(url);
  };

  return (
    <div className="h-dvh w-full flex flex-col items-center">
      <Navbar />

      <div className="px-4 w-full flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
          YouTube Video Sharer
        </h1>

        <div className="w-full max-w-lg shrink-0">
          <Form
            onResponse={handleFormResponse}
            isLoading={isLoading}
            handleIsLoading={handleIsLoading}
          />
        </div>

        {formResponse?.error ? (
          <p className="text-red-500 mt-4">{formResponse.error}</p>
        ) : formResponse ? (
          <YTImage
            {...(formResponse as FormResponse)}
            handleIsLoading={handleIsLoading}
            handleGeneratedImageUrl={handleGeneratedImageUrl}
          />
        ) : null}

        <div className="flex-1 w-full min-h-0 flex items-center justify-center py-6">
          {/* if loading has finished and image is generated then show the image */}
          {/* if loading isnt finished then dont show the skeleton image */}
          {!isLoading && generatedImageUrl ? (
            <img
              src={generatedImageUrl}
              alt="Generated YouTube Card"
              className="max-h-full max-w-full w-auto h-auto rounded-xl shadow-2xl border border-gray-200 object-contain"
            />
          ) : isLoading ? (
            formResponse ? (
              // Optional: A placeholder while canvas is drawing (usually milliseconds, but good for UX)
              <div className="h-full aspect-1080/1014 max-h-full bg-gray-200 animate-pulse rounded-xl" />
            ) : null
          ) : null}
        </div>
      </div>
    </div>
  );
}
