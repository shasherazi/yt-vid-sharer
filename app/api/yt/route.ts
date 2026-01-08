import { google } from "googleapis";

const youtube = google.youtube("v3");
const apiKey = process.env.GOOGLE_CONSOLE_API_KEY;

export async function POST(request: Request) {
  // url examples
  // https://youtu.be/dQw4w9WgXcQ?si=OW1ojMZjbg-sv8_d
  // https://www.youtube.com/watch?v=Ts6SW099X08
  // https://youtu.be/Ts6SW099X08
  // https://www.youtube.com/shorts/qOaURdxBlvE
  // https://youtube.com/shorts/CHM_Yk6szaI?si=CyJkVfD_IhQl63St
  const { url } = await request.json();

  const id = (() => {
    try {
      const urlObj = new URL(url);

      // 1. Normalize hostname: remove "www." and "m." to handle all variations
      const hostname = urlObj.hostname.replace(/^(www\.|m\.)/, "");

      // 2. Handle Shortened Links (youtu.be/ID)
      if (hostname === "youtu.be") {
        return urlObj.pathname.slice(1);
      }

      // 3. Handle Standard Links (youtube.com)
      if (hostname === "youtube.com") {
        // Case: /watch?v=ID
        if (urlObj.pathname === "/watch") {
          return urlObj.searchParams.get("v");
        }
        // Case: /shorts/ID
        else if (urlObj.pathname.startsWith("/shorts/")) {
          return urlObj.pathname.split("/")[2];
        }
      }
      return null;
    } catch (error) {
      console.error("Error parsing URL:", error);
      return null;
    }
  })();

  if (!id) {
    return Response.json({ error: "Invalid YouTube URL" }, { status: 400 });
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

  console.log(response);

  return new Response(JSON.stringify(response), { status: 200 });
}
