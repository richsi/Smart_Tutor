import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, getDocs, collection, query, where, addDoc, orderBy, deleteDoc } from 'firebase/firestore';
import { CommentItem, ThreadItem } from './types';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAnV6GOP1v696Iz4dVALMNSjl1pthOo5ug",
  authDomain: "smartube-3c7e8.firebaseapp.com",
  projectId: "smartube-3c7e8",
  storageBucket: "smartube-3c7e8.appspot.com",
  messagingSenderId: "254094995285",
  appId: "1:254094995285:web:19de821dde97e11cd809dc",
  measurementId: "G-M50MYX2BTJ"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Function to get the summary of a video from Firestore
export async function getVideoSummary(videoId:string) {
    const videoRef = doc(db, 'Video', videoId);
    const docSnap = await getDoc(videoRef);
    
    if (docSnap.exists()) {
        return docSnap.data().Summary; // Assuming the field is named 'Summary'
    } else {
        throw new Error('No such video document!');
    }
}

export async function getVideoThreads(videoId:string) {
    try {
        const videoRef = doc(db, 'Video', videoId);
        const videoDocSnap = await getDoc(videoRef);

        // Check if the video document exists
        if (!videoDocSnap.exists()) {
            throw new Error('No such video document!');
        }

        const threadsRef = collection(db, 'Video', videoId, 'Thread');
        const querySnapshot = await getDocs(query(threadsRef, orderBy('CreatedTimestamp', 'asc')));

        let threads:ThreadItem[] = [];
        querySnapshot.forEach((doc) => {
            // Add each thread data to the threads array
            threads.push({ ThreadId: doc.id, ...doc.data() } as ThreadItem);
        });

        // Check if there are no threads
        if (threads.length === 0) {
            throw new Error('No threads found for this video.');
        }

        return threads;
    } catch (error) {
        // Handle errors from the Firebase operation
        console.error("Error fetching video threads:", error);
        throw error; // Rethrow the error for the caller to handle
    }
}
export async function getThreadComments(videoId:string,threadId:string) {
    try {
        const commentsRef = collection(
            db,
            'Video',
            videoId,
            'Thread',
            threadId,
            'Comments'
          );
       
        let comments:CommentItem[] = [];
        const commentsSnapshot = (await getDocs(commentsRef));
        if (commentsSnapshot.empty) {
            
            
            throw new Error('No such comment document!');
            
        }
        commentsSnapshot.forEach((doc) =>
            comments.push({CommentId: doc.id,...doc.data()} as CommentItem)
        );
              
        

        
        // Check if there are no threads
        if (comments.length === 0) {
            throw new Error('No comments found for this thread.');
        }
        
        return {comments:comments,commentsSize:commentsSnapshot.size};
    } catch (error) {
        // Handle errors from the Firebase operation
        throw error; // Rethrow the error for the caller to handle
    }
}

export async function addCommentstoThreads(videoId:string,threadId:string,comment:CommentItem) {
    try {
        
        await addDoc(collection(
            db,
            'Video',
            videoId,
            'Thread',
            threadId,
            'Comments'
          ),comment);
        
        
      
        
    } catch (error) {
        // Handle errors from the Firebase operation
        console.error("Error fetching thread comments:", error);
        throw error; // Rethrow the error for the caller to handle
    }
}

export async function deleteCommentsfromThreads(videoId:string,threadId:string, commentId:string) {
    try {
        
        await deleteDoc(doc(
            db,
            'Video',
            videoId,
            'Thread',
            threadId,
            'Comments',
             commentId
          ));
        
        
      
        
    } catch (error) {
        // Handle errors from the Firebase operation
        console.error("Error fetching thread comments:", error);
        throw error; // Rethrow the error for the caller to handle
    }
}
// Navya Task : Ming's request - make a function that fetches data about video from database and if not there, then call backend function
// I'm not sure if this is the right place for this function but I hope it is

// do only for backend 

export async function fetchVideoData(videoId:string) {
    const apiUrl = 'http://localhost:3000/data';
    const baseYouTubeUrl = 'https://youtu.be/';
    const videoLink = baseYouTubeUrl + videoId;
    const prompt = "";

    const requestData = {
      link: videoLink,
      prompt: prompt,
    };
  
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
}