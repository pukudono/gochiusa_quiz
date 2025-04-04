from flask import Flask, jsonify
from flask_cors import CORS
import random
import json
import os

app = Flask(__name__)
CORS(app)

# 🎵 songs.json から楽曲データを読み込む
songs_file = os.path.join(os.path.dirname(__file__), "songs.json")
with open(songs_file, "r", encoding="utf-8") as f:
    songs = json.load(f)

@app.route("/random_song", methods=["GET"])
def random_song():
    """ランダムな楽曲を1つ返すAPI"""
    song = random.choice(songs)
    return jsonify(song)

@app.route("/all_songs", methods=["GET"])
def all_songs():
    """すべての楽曲リストを返すAPI"""
    return jsonify(songs)  # `songs_data` ではなく、既存の `songs` をそのまま返す

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
