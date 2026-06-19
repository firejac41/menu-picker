import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const keyword = searchParams.get("keyword");

  const res = await fetch(
    `https://dapi.kakao.com/v2/local/search/keyword.json?query=${keyword}&x=${lng}&y=${lat}&radius=1000&size=15`,
    {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`,
      },
    }
  );

  const data = await res.json();
  return NextResponse.json(data);
}