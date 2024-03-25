import re
from youtube_transcript_api import YouTubeTranscriptApi 
from youtube_transcript_api._errors import TranscriptsDisabled

# Function to get transcript from a YouTube video URL
def get_transcript(youtube_url):

  matchtwo = re.search(r'\?v=([^&]*)', youtube_url)

  if matchtwo:
      video_id = matchtwo.group(1)
      srt = YouTubeTranscriptApi.get_transcript(video_id)

      file_name = video_id + ".txt"
      path = 'data/' + file_name

      with open(path, 'w') as f:
        f.write(str(srt))
      
      return video_id
  else:
     return None
  
#Navya Task: This thing below
# Function to get transcript from a video ID
def gettranscript_videoID(video_id):
  try:
    # Attempt to get transcript using YouTubeTranscriptApi
    srt = YouTubeTranscriptApi.get_transcript(video_id)
  except TranscriptsDisabled as e:
         # Handle the case where transcripts are disabled for the video
        print(f"Transcripts are disabled for the video: {e}") 
        #test this with video https://www.youtube.com/watch?v=wejz5s31Cts
         # Set a placeholder value for the transcript
        srt = "Transcripts are disabled for the video."
  # Create a file with the transcript content
  file_name = video_id + ".txt"
  path = 'data/' + file_name

  with open(path, 'w') as f:
    f.write(str(srt))
# Function to generate transcript from a video ID     
def generate_transcript(video_id):
  # Get transcript using YouTubeTranscriptApi
  srt = YouTubeTranscriptApi.get_transcript(video_id)
  # Check if the transcript is empty
  if not srt:
     return None
  
  return srt
