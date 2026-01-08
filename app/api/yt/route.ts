import { google } from "googleapis";

const youtube = google.youtube("v3");
const apiKey = process.env.GOOGLE_CONSOLE_API_KEY;

export async function POST(request: Request) {
  // url examples
  // https://youtu.be/dQw4w9WgXcQ?si=OW1ojMZjbg-sv8_d
  // https://www.youtube.com/watch?v=Ts6SW099X08
  // https://youtu.be/Ts6SW099X08
  const { url } = await request.json();
  const id = (() => {
    const urlObj = new URL(url);
    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.slice(1).split("?")[0];
    } else if (
      urlObj.hostname === "www.youtube.com" ||
      urlObj.hostname === "youtube.com"
    ) {
      return urlObj.searchParams.get("v");
    }
    return null;
  })();

  if (!id) {
    return new Response(
      JSON.stringify({ error: "Invalid YouTube URL provided." }),
      { status: 400 },
    );
  }

  const video = await youtube.videos.list({
    key: apiKey,
    id: [id],
    part: ["contentDetails", "snippet", "statistics"],
    fields:
      "items(contentDetails(duration),snippet(title, publishedAt, channelTitle, channelId, thumbnails), statistics(viewCount))",
  });

  const channel = await youtube.channels.list({
    key: apiKey,
    id: [video.data.items![0].snippet!.channelId!],
    part: ["snippet"],
    fields: "items(snippet(thumbnails))",
  });

  const response = {
    id: id,
    title: video.data.items![0].snippet!.title,
    publishedAt: video.data.items![0].snippet!.publishedAt,
    duration: video.data.items![0].contentDetails!.duration,
    viewCount: video.data.items![0].statistics!.viewCount,
    channelTitle: video.data.items![0].snippet!.channelTitle,
    thumbnails: video.data.items![0].snippet!.thumbnails,
    channelThumbnails: channel.data.items![0].snippet!.thumbnails,
  };

  return new Response(JSON.stringify(response), { status: 200 });
}
