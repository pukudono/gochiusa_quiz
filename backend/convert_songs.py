import csv
import json
import os

# songs.csv のパス
csv_file = os.path.join(os.path.dirname(__file__), "songs.csv")
json_file = os.path.join(os.path.dirname(__file__), "songs.json")

# CSV を読み込む
songs = []
with open(csv_file, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        songs.append({"video_id": row["video_id"], "title": row["title"]})

# JSON に変換して保存
with open(json_file, "w", encoding="utf-8") as f:
    json.dump(songs, f, ensure_ascii=False, indent=2)

print(f"JSONファイルに変換完了！{len(songs)} 曲を保存しました。")
