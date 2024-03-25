import { Timestamp } from 'firebase/firestore'

export * from './DOMMessages'

export interface ThreadItem{
    ThreadId: string
    CreatedBy: string
    CreatedTimestamp: Timestamp
    FirstComment: string
    LastUpdated: Timestamp
    Title: string
    // Replies: number
    Likes?:number
}



export interface CommentItem{
    CommentId?: string
    CommentText:string
    CreatedBy:string
    CreatedTimestamp?:Timestamp
    LastUpdated?:Timestamp


}