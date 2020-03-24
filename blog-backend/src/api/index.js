import Router from 'koa-router';
import posts from './posts';

const api = new Router();

// api.get('/test',ctx=>{
//     ctx.body='성공'
// })
api.use('/posts', posts.routes());

// 라우터 내보내기
export default api;