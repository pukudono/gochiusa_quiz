import { useState, useEffect } from "react";
import YouTubePlayer from "./components/YouTubePlayer";

function App() {
  const [startQuiz, setStartQuiz] = useState(false);
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [allSongs, setAllSongs] = useState([]);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const fetchAllSongs = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/all_songs");
        const data = await response.json();
        setAllSongs(data);
      } catch (error) {
        console.error("全曲データの取得エラー:", error);
      }
    };
    fetchAllSongs();
  }, []);

  const fetchRandomSong = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/random_song");
      const data = await response.json();
      console.log("取得したデータ:", data);

      setVideoId(data.video_id);
      setShowVideo(false);

      const randomStart = Math.floor(Math.random() * 80) + 10;
      setStartTime(randomStart);

      if (allSongs.length === 0) return;

      const incorrectChoices = allSongs
        .filter(song => song.title !== data.title)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(song => song.title);

      const choices = [data.title, ...incorrectChoices].sort(() => Math.random() - 0.5);

      setQuestion({
        songTitle: data.title,
        choices: choices,
        correctAnswer: data.title,
      });

      setFeedback("");
    } catch (error) {
      console.error("データ取得エラー:", error);
    }
  };

  useEffect(() => {
    if (startQuiz && allSongs.length > 0 && !question) {
      fetchRandomSong();
    }
  }, [startQuiz, allSongs]);

  const handleAnswerClick = (choice) => {
    setShowVideo(true);
    if (choice === question.correctAnswer) {
      setFeedback("✅ 正解！");
    } else {
      setFeedback(`❌ 不正解！ 正解は「${question.correctAnswer}」`);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      width: "100vw",
      textAlign: "center",
      padding: "20px",
      backgroundColor: "#eaeaea"
    }}>
      <div style={{
        maxWidth: "600px",
        width: "100%",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "white",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px"
      }}>
        {!startQuiz ? (
          <>
            <h1 style={{ color: "#333" }}>ごちうさ楽曲クイズ！</h1>
            <p style={{ color: "#555", fontSize: "14px", marginBottom: "10px" }}>
              本アプリはYouTubeの動画を使用しています。著作権は各権利者に帰属し、商用利用は一切行いません。
            </p>
            <button
              onClick={() => setStartQuiz(true)}
              style={{
                fontSize: "20px",
                padding: "10px 20px",
                width: "100%",
                maxWidth: "400px",
                marginTop: "20px"
              }}
            >
              クイズを開始！
            </button>
          </>
        ) : question ? (
          <>
            <h2>この曲のタイトルは？</h2>
            {videoId && <YouTubePlayer videoId={videoId} showVideo={showVideo} startTime={startTime} />}
            <div style={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%"
            }}>
              {question.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(choice)}
                  style={{
                    display: "block",
                    margin: "10px auto",
                    fontSize: "18px",
                    padding: "10px 20px",
                    width: "100%",
                    maxWidth: "400px",
                    textAlign: "center"
                  }}
                >
                  {choice}
                </button>
              ))}
            </div>
            {feedback && <h3>{feedback}</h3>}
            {feedback && (
              <button
                onClick={fetchRandomSong}
                style={{
                  fontSize: "18px",
                  padding: "10px 20px",
                  marginTop: "20px",
                  width: "100%",
                  maxWidth: "400px"
                }}
              >
                次の問題へ
              </button>
            )}
          </>
        ) : (
          <h2>読み込み中...</h2>
        )}
      </div>
    </div>
  );
}

export default App;
