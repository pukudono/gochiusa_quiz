import React, { useEffect, useRef } from "react";

const YouTubePlayer = ({ videoId, showVideo, startTime }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!videoId) return;

    const handlePlayerCommands = () => {
      if (iframeRef.current) {
        const player = iframeRef.current.contentWindow;

        if (!showVideo) {
          // 1秒後に動画を停止
          setTimeout(() => {
            player.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*");
          }, 1000);
        } else {
          // 🎯 回答選択後に動画の続きから再生
          player.postMessage('{"event":"command","func":"playVideo","args":""}', "*");
        }

        // 🎵 音量を50%に設定（毎回MAX回避）
        setTimeout(() => {
          player.postMessage('{"event":"command","func":"setVolume","args":[8]}', "*");
        }, 500);
      }
    };

    // iframe のロード完了を待ってから操作
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("load", handlePlayerCommands);
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener("load", handlePlayerCommands);
      }
    };
  }, [videoId, showVideo]);

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&start=${startTime}&mute=0&enablejsapi=1`;

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
      <iframe
        ref={iframeRef}
        width={showVideo ? "560" : "0"}
        height={showVideo ? "315" : "0"}
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        style={{ display: showVideo ? "block" : "none" }}
      ></iframe>
    </div>
  );
};

export default YouTubePlayer;
