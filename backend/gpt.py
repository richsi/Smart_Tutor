import os
import sys
import constants

from langchain.document_loaders import TextLoader
from langchain.document_loaders import DirectoryLoader
from langchain.indexes import VectorstoreIndexCreator
from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI
# Set the OpenAI API key from constants module to the environment variable
os.environ["OPENAI_API_KEY"] = constants.API_KEY 

# Function to print the completion of a chat prompt for a given video ID and prompt
def print_chat_completion(vid_id, prompt):
  # Set the input query as the provided prompt
  query = prompt
  # Construct the path to the directory containing the data for the given video ID

  path = "data/" + vid_id

  # Load text data from the specified directory using TextLoader

  loader = TextLoader(path)
  # Create an index from the loaded text data using VectorstoreIndexCreator

  index = VectorstoreIndexCreator().from_loaders([loader])
  # Query the index using the provided prompt and the ChatOpenAI language model

  context = index.query(query, llm=ChatOpenAI())
  # Print the video ID for reference

  print("file",vid_id)

  return context

# Function to generate chat completion from a given transcript and prompt

def generate_chat_completion(transcript, prompt):
# Set the input query as the provided prompt

  query = prompt

  # Write the transcript to a temporary text file

  path = "data/temp.txt"
  with open(path, "w") as f:
    f.write(transcript)
  # Load text data from the temporary text file using TextLoader

  loader = TextLoader(path)
  # Create an index from the loaded text data using VectorstoreIndexCreator

  index = VectorstoreIndexCreator().from_loaders([loader])

  # Query the index using the provided prompt and the ChatOpenAI language model

  context = index.query(query, llm=ChatOpenAI())
  # Remove the temporary text file

  try:
    os.remove(path)
  except Exception as e:
    print(f"An error occured while deleting the file: {e}")

  return context