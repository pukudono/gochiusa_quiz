import requests
import csv
import os

API_KEY = "AIzaSyCZEJ1GuVShPCMQk8-UtQMUfMYPQwWAKHA"
PLAYLIST_ID = "PL3w4YrAfCCwS2vEqSUXrCKnK-F4-SrYX-"  # ごちうさ楽曲プレイリスト
YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/playlistItems"
VIDEO_API_URL = "https://www.googleapis.com/youtube/v3/videos"

def fetch_playlist_videos():
    all_videos = []
    next_page_token = None

    while True:
        params = {
            "part": "snippet",
            "playlistId": PLAYLIST_ID,
            "maxResults": 100,
            "key": API_KEY,
        }
        if next_page_token:
            params["pageToken"] = next_page_token

        response = requests.get(YOUTUBE_API_URL, params=params)
        data = response.json()

        if "items" in data:
            for item in data["items"]:
                title = item["snippet"]["title"]
                video_id = item["snippet"]["resourceId"]["videoId"]
                all_videos.append((video_id, title))

        next_page_token = data.get("nextPageToken")
        if not next_page_token:
            break

    return all_videos

def check_video_status(video_id):
    """動画が再生可能かチェック"""
    params = {
        "part": "status",
        "id": video_id,
        "key": API_KEY,
    }
    response = requests.get(VIDEO_API_URL, params=params)
    data = response.json()

    if "items" in data and len(data["items"]) > 0:
        status = data["items"][0]["status"]
        if status.get("privacyStatus") == "public":
            return True  # 公開動画ならOK
    return False  # 非公開・削除ならNG

# 🎵 プレイリストから動画を取得
videos = fetch_playlist_videos()
valid_videos = []

for video_id, title in videos:
    if check_video_status(video_id):
        valid_videos.append((video_id, title))

# **修正ポイント**
# 1. 実行フォルダを基準に `songs.csv` を保存するよう修正
output_file = os.path.join(os.path.dirname(__file__), "songs.csv")

# 2. CSVファイルに保存
with open(output_file, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["video_id", "title"])  # ヘッダー
    writer.writerows(valid_videos)

print(f"取得完了！ {len(valid_videos)} 曲を保存しました 🎶（削除・非公開動画を除外済み）")
