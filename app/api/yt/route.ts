import { google } from "googleapis";

const youtube = google.youtube("v3");
const apiKey = process.env.GOOGLE_CONSOLE_API_KEY;

export async function POST() {
  const video = await youtube.videos.list({
    key: apiKey,
    id: ["dQw4w9WgXcQ"],
    part: ["contentDetails", "snippet"],
    fields:
      "items(contentDetails(duration),snippet(title, publishedAt, channelTitle, channelId, thumbnails))",
  });

  const channel = await youtube.channels.list({
    key: apiKey,
    id: [video.data.items![0].snippet!.channelId!],
    part: ["snippet"],
    fields: "items(snippet(thumbnails))",
  });

  const response = {
    title: video.data.items![0].snippet!.title,
    publishedAt: video.data.items![0].snippet!.publishedAt,
    duration: video.data.items![0].contentDetails!.duration,
    channelTitle: video.data.items![0].snippet!.channelTitle,
    thumbnails: video.data.items![0].snippet!.thumbnails,
    channelThumbnails: channel.data.items![0].snippet!.thumbnails,
  };

  console.log(response);
  return new Response();
}
