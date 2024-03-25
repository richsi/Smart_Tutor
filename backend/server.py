import flask
from flask import Flask, request, jsonify
import gpt
import transcript
from flask_cors import CORS
#moving over from my code
import firebase_admin
from firebase_admin import credentials, firestore
import comments
from datetime import datetime

#navya task: getting backend to firebase connections

# Setting up the Firebase credentials
cred = credentials.Certificate("backend/smartube-3c7e8-firebase-adminsdk-805sc-be8619564c.json")  # the firebase key (i dont have permission to get this)
firebase_admin.initialize_app(cred)
db = firestore.client() # can call database as now db

# Initializing flask app
app = Flask(__name__)
cors_resources = {
    r"/data": {"origins": "*"},
    r"/send-question": {"origins": "*"}
}

CORS(app, resources={r"/send-question": {"origins": "*"},r"/data": {"origins": "*"}}, supports_credentials=True, allow_headers=["Content-Type", "Access-Control-Allow-Credentials"])


@app.route('/')
def hello_world():
    return 'SmartTutor Flask Server is running TEST.'
    
# Route for setting and retrieving data
@app.route('/data', methods=["GET", "POST"])
def set_data():

  data = request.json
  link = data.get("link", "")
  prompt = data.get("prompt", "")

  print("Printing Link", link)
  
  #Navya Task: Fix this to returd ID so the "link" prints ID
  transcript.gettranscript_videoID(link)
  youtube_id = link
  print(youtube_id)


  if youtube_id is not None:
    youtube_id_file = youtube_id + ".txt"
  if youtube_id:
    context = gpt.print_chat_completion(youtube_id_file, prompt)
    print("Context",context)

    print("storing video data...")
    store_video_data(youtube_id, context)


    return jsonify({
		'user':"system", 
		"context":context,
    "link":link,
    "prompt":prompt,
	  })
  else:
    print("No transcript found for this video.")
    context = "No transcript found for this video."
    prompt = ""

    return jsonify({
      'user':"system", 
      "context":context,
      "link":link,
      "prompt": prompt,
	})

# Route for sending a question and adding comments to threads
@app.route('/send-question', methods=["POST"])
def add_comments_to_threads():
    data = request.json
    prompt = data.get("question", "")
    createdBy = data.get("createdBy", "")
    videoId = data.get("videoId", "")
    print("data")
    timestamp = datetime.now()
    # Fetch the transcript from Firestore or generate it

    transcript = db.collection("Video").document(videoId).get().to_dict().get("Transcript", None)
    if transcript is None:
      transcript = transcript.generate_transcript(videoId)
    # Generate an answer using GPT

    answer = gpt.generate_chat_completion(transcript, prompt)
    # Prepare data to store in Firestore

    data = {
      "CreatedBy": createdBy,
      "CreatedTimestamp" : timestamp,
      "FirstComment" : answer,
      "LastUpdated" : timestamp,
      "Title" : prompt
    }
    # Add the data to the "Thread" collection under the specific video ID

    db.collection("Video").document(videoId).collection("Thread").document().set(data)
    return jsonify(data)
    # RICHARD: TODO: function generates data in json format here. I need to know how to get thread_id in order to store the data in the correct spot

#this function should request video id and transcript from youtube API and then store it in firebase
def store_video_data(youtube_id,summary):
    data = request.get_json()
    link = data.get('link', '')
    youtube_id_file_name = youtube_id + ".txt"
    
    file_path = 'data/' + youtube_id_file_name
    with open(file_path, 'r') as file:
      file_contents = file.read()

    video_data = { #get ready to store into database
      "Summary" : summary,
      "Transcript" : file_contents,
      "URL": link
    }

    video_ref = db.collection("Video").document(youtube_id)
    video_doc = video_ref.get()

    if video_doc.exists:
      thread_data = {
        "CreatedBy": "richard",
        "FirstComment" : "This is the first comment",
        "Title" : "This is the title"
      }
      video_ref.collection("Thread").document(youtube_id).set(thread_data)
      return jsonify({"success": False, "message": "Video already exists"}), 409
    else:
      # If document does not exist
      video_ref.set(video_data)  # This creates a document with the ID 'video_name'
      return jsonify({"success": True, "message": "Video created successfully"}), 201


    db.collection("insertcollectionnameforthis").add(video_data)  # store in proper firebase collection
    return jsonify({"message": "Video data stored successfully"})


#video ID not url 
	
# Running app
if __name__ == '__main__':
	app.run(debug=True, port=3000)
