from flask import Flask, request, session, jsonify
from flask_session import Session

app = Flask(__name__)

# Configure session storage
app.config["SESSION_TYPE"] = "filesystem"  # Stores session files on the server
app.config["SECRET_KEY"] = "your_secret_key"
Session(app)

@app.route("/submit", methods=["POST"])
def submit_form():
    userform = request.form  # Retrieve form data
    name = userform.get("name")
    email = userform.get("email")
    phone = userform.get("phone")
    ID_number = userform.get("ID_number")

    # Basic validation
    if not name or not email or len(phone) < 10 or len(ID_number) != 13:
        return jsonify({"error": "Invalid input"}), 400

    # Store validated data in session
    session["user_data"] = {"name": name, "email": email, "phone": phone, "ID_number": ID_number}
    return jsonify({"message": "Data stored temporarily", "data": session["user_data"]})

@app.route("/get-data", methods=["GET"])
def get_data():
    if "user_data" in session:
        return jsonify(session["user_data"])
    return jsonify({"message": "No data found"}), 404

@app.route("/clear-data", methods=["POST"])
def clear_data():
    session.pop("user_data", None)
    return jsonify({"message": "Data cleared"})

if __name__ == "__main__":
    app.run(debug=True)
