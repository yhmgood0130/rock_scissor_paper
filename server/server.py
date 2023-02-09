import os
import psycopg2
from dotenv import load_dotenv
from flask import Flask, request, jsonify

CREATE_GAME_TABLE = (
    "CREATE TABLE IF NOT EXISTS games (id SERIAL PRIMARY KEY, player_1_username TEXT NOT NULL, player_2_username TEXT, user_1_choice TEXT, user_2_choice TEXT, winner TEXT, last_played TIMESTAMP);"
)

CHECK_EXISTING_GAME = "SELECT * FROM games WHERE player_1_username = %s AND player_2_username = %s AND winner is NULL;"

CREATE_GAME = "INSERT INTO games (player_1_username, player_2_username, last_played) values (%s, %s, NOW()) RETURNING id;"

UPDATE_GAME = "UPDATE games SET (user_1_choice, user_2_choice, winner, last_played) = (%s, %s, %s, NOW()) WHERE id = %s AND winner is NULL RETURNING id;"

load_dotenv()  # loads variables from .env file into environment

app = Flask(__name__)
url = os.environ.get("DATABASE_URL")  # gets variables from environment
connection = psycopg2.connect(url)


@app.route("/games", methods=['POST'])
def create_game():
    data = request.get_json()
    player_1 = data["player_1"]
    player_2 = data["player_2"]
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_GAME_TABLE)
            cursor.execute(CHECK_EXISTING_GAME, (player_1, player_2))
            game = cursor.fetchone()
            if game is not None:
                return {"game_id": game[0], "user_1_choice": game[3]}, 200
            cursor.execute(CREATE_GAME, (player_1, player_2))
            game_id = cursor.fetchone()
        return {"game_id": game_id}, 201


@app.route("/games/<int:id>", methods=["PUT"])
def update_game(id):
    data = request.get_json()
    user_1_choice = data["user_1_choice"]
    user_2_choice = data["user_2_choice"]
    if "winner" in data:
        winner = data["winner"] if data["winner"] is not None else None
    else:
        winner = None
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(UPDATE_GAME, (user_1_choice,
                           user_2_choice, winner, id))
            game = cursor.fetchone()
            if game is None:
                return jsonify({"error": "Invalid request! Please try with valid request"}), 400
            return jsonify({"message": 'Succesfully updated'}), 200


if __name__ == "__main__":
    app.run(debug=True)
