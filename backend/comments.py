import constants
from googleapiclient.discovery import build
import json

# Create a YouTube API client using the API key from constants module
youtube = build('youtube', 'v3', developerKey=constants.YOUTUBE_DATA_API_KEY)
# Function to retrieve replies for a given comment ID
def get_comment_replies(parent_id):
    replies = []
    next_page_token = None
    # Fetch replies in batches of 100 until there are no more pages
    while True:
        response = youtube.comments().list(
            part='snippet',
            parentId=parent_id,
            maxResults=100,
            pageToken=next_page_token,
            textFormat='plainText'
        ).execute()
        # Extract reply text from each item in the response

        for item in response['items']:
            reply = item['snippet']['textDisplay']
            replies.append(reply)

        next_page_token = response.get('nextPageToken')
        if not next_page_token:
            break

    return replies
# Function to retrieve comments and their replies for a given video ID

def get_comments(video_id):
    comments_data = []
    next_page_token = None
    # Fetch comments and their replies in batches of 100 until there are no more pages

    while True:
        response = youtube.commentThreads().list(
            part='snippet,replies',
            videoId=video_id,
            maxResults=100,
            pageToken=next_page_token,
            textFormat='plainText'
        ).execute()
        # Extract comment information and replies for each item in the response
        for item in response['items']:
            comment_info = {}
            top_level_comment = item['snippet']['topLevelComment']
            comment_info['comment'] = top_level_comment['snippet']['textDisplay']

            # Check if there are replies to the comment
            # Check if there are replies to the comment and fetch them
            comment_info['replies'] = []
            if 'replies' in item:
                replies = get_comment_replies(top_level_comment['id'])
                comment_info['replies'].extend(replies)

            comments_data.append(comment_info)

        next_page_token = response.get('nextPageToken')
        if not next_page_token:
            break

    return comments_data
# Function to generate a JSON representation of comments for a given video URL
def produce_comments_json(video_url):
    video_url = 'https://www.youtube.com/watch?v=62YYY5Uobi4'
    # Extract video ID from the YouTube video URL
    # Retrieve comments and their replies for the video

    video_id = video_url.split('v=')[1]
    comments_data = get_comments(video_id)
    # Convert comments data to JSON format with proper indentation

    comments_json = json.dumps(comments_data, indent=4)
    return comments_json


