"use client";

import { useState } from "react";

const LOADING_MESSAGES = [
  "주변 식당에 전화 돌리는 중...",
  "식당들이랑 협상 중...",
  "가장 맛있는 곳 뇌물 받는 중...",
  "오늘의 희생양 선정 중...",
  "당신의 지갑 사정 파악 중...",
];

const PASS_MESSAGES = [
  "정말요? 거기 맛있는데... 😢",
  "...진짜요? 😒",
  "마지막 경고입니다 👁️",
];

export default function Home() {
  const [step, setStep] = useState<"home" | "loading" | "result" | "dead">("home");
  const [loadingMsg, setLoadingMsg] = useState("");
  const [passCount, setPassCount] = useState(0);
  const [result, setResult] = useState<any>(null);
  

const [loadingMsg2, setLoadingMsg2] = useState("");
  const [showMsg2, setShowMsg2] = useState(false);

const KEYWORDS = ["한식", "중식", "일식", "양식", "분식", "치킨", "피자", "고기"];

const handleStart = () => {
    const msg1 = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
    let msg2 = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
    while (msg2 === msg1) {
      msg2 = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
    }

    setLoadingMsg(msg1);
    setLoadingMsg2(msg2);
    setShowMsg2(false);
    setStep("loading");

    setTimeout(() => {
      setShowMsg2(true);
    }, 1500);

    const fetchWithLocation = async (lat: number, lng: number) => {
      const keyword = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];
      const res = await fetch(`/api/search?lat=${lat}&lng=${lng}&keyword=${keyword}`);
      const data = await res.json();
      const places = data.documents;

      if (!places || places.length === 0) {
        setStep("dead");
        return;
      }

      const picked = places[Math.floor(Math.random() * places.length)];
      setTimeout(() => {
        setResult(picked);
        setStep("result");
      }, 3500);
    };

    const fetchByIP = async () => {
      const ipRes = await fetch("https://ipapi.co/json/");
      const ipData = await ipRes.json();
      await fetchWithLocation(ipData.latitude, ipData.longitude);
    };

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await fetchWithLocation(pos.coords.latitude, pos.coords.longitude);
      },
      async () => {
        await fetchByIP();
      },
      { timeout: 5000 }
    );
  };

  const handlePass = () => {
    if (passCount >= 2) {
      setStep("dead");
      return;
    }
    setPassCount(passCount + 1);
    handleStart();
  };

 const handleAccept = () => {
    window.open(result.place_url, "_blank");
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-8">
      {step === "home" && (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-orange-500 mb-4">🍽️ 오늘 뭐 먹지?</h1>
          <p className="text-gray-500 mb-8">운명이 정해드립니다. 거부는 3번만 가능해요.</p>
          <button
            onClick={handleStart}
            className="bg-orange-500 text-white px-8 py-4 rounded-full text-xl font-bold hover:bg-orange-600"
          >
            운명 받아들이기 🎰
          </button>
        </div>
      )}

   {step === "loading" && (
        <div className="text-center">
          <div className="text-6xl mb-6 animate-bounce">🔮</div>
          <p className="text-xl text-gray-600">
            {showMsg2 ? loadingMsg2 : loadingMsg}
          </p>
        </div>
      )}

      {step === "result" && result && (
        <div className="text-center">
          <p className="text-gray-400 mb-2">오늘의 운명은...</p>
          <h2 className="text-3xl font-bold text-orange-500 mb-2">{result.place_name}</h2>
          <p className="text-gray-500 mb-8">{result.road_address_name}</p>
          {passCount < 3 && (
            <p className="text-red-400 mb-4 text-sm">
              {passCount > 0 ? PASS_MESSAGES[passCount - 1] : `패스 기회 ${3 - passCount}번 남음`}
            </p>
          )}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handlePass}
              className="bg-gray-200 text-gray-600 px-6 py-3 rounded-full font-bold hover:bg-gray-300"
            >
              싫어요 😤
            </button>
            <button
              onClick={handleAccept}
              className="bg-orange-500 text-white px-6 py-3 rounded-full font-bold hover:bg-orange-600"
            >
              오늘은 이거다! 🎉
            </button>
          </div>
        </div>
      )}

      {step === "dead" && (
        <div className="text-center">
          <div className="text-6xl mb-6">🏪</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">당신은 오늘 편의점입니다.</h2>
          <p className="text-gray-400 mb-8">안녕히 가세요.</p>
          <button
            onClick={() => { setStep("home"); setPassCount(0); setResult(null); }}
            className="bg-gray-500 text-white px-6 py-3 rounded-full font-bold hover:bg-gray-600"
          >
            처음으로
          </button>
        </div>
      )}
    </div>
  );
}