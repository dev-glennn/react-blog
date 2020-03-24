import mongoose from 'mogoose'

const {Schema} = mongoose

const PostSchema = new Schema({
    title: String,
    body: String,
    tags: [String], // 문자열로 이루어진 배열
    publishedDate: {
        type: Date,
        default: Date.now, // 현재 날짜를 기본값으로 설정
    }
})

const Post = mongoose.model('Post', PostSchema) // model('스키마 이름', 스키마객체)
export default Post;