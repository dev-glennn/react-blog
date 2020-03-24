import Post from '../../models/post';

/**
 * POST /api.posts
 *
 * {
 *     title : '제목',
 *     body : '내용',
 *     tags : ['태그1', '태그2']
 * }
 *
 * @param ctx
 * @returns {Promise<void>}
 */
export const write = async ctx => {
    const {title, body, tags} = ctx.request.body;
    const post = new Post({
        title,
        body,
        tags,
    });
    try {
        await post.save();
        ctx.body = post;
    } catch (e) {
        ctx.throw(500, e);
    }
};

/**
 * GET /api/posts
 *
 * @param ctx
 * @returns {Promise<void>}
 */
export const list = async ctx => {
    try {
        const posts = await Post.find().exec();
        ctx.body = posts;
    } catch (e) {
        ctx.throw(500, e)
    }
};

/**
 * GET /api/posts/:id
 *
 * @param ctx
 * @returns {Promise<void>}
 */
export const read = async ctx => {
    const {id} = ctx.params;
    try {
        const post = await Post.findById(id).exec();
        if (!post) {
            ctx.status = 404; // Not Found
            return;
        }
        ctx.body = post;
    } catch (e) {
        ctx.throw(500, e)
    }
};

/**
 * DELETE /api/posts/:id
 *
 * @param ctx
 * @returns {Promise<void>}
 */
export const remove = async ctx => {
    const {id} = ctx.params;
    try {
        /*
        remove() : 특정 조건을 만족하는 데이터를 모두 지음
        findByIdAndRemove() : id 를 찾아서 지움
        findOneAndRemove() : 특정 조건을 만적하는 데이터 하나를 찾아서 지움
         */
        await Post.findByIdAndRemove(id).exec();
        ctx.status = 204; // No Content (성공했지만 응답데이터 없음)
    } catch (e) {
        ctx.throw(500, e)
    }
};

/**
 * PATCH /api/posts/:id
 *
 * {
 *     title : '수정',
 *     body : '수정 내용',
 *     tags : ['수정', '태그']
 * }
 *
 * @param ctx
 * @returns {Promise<void>}
 */
export const update = async ctx => {
    const {id} = ctx.params;
    try {
        // new : true => 업데이트 된 데이터를 반환
        // new : false => 업데이트 되기 전의 데이터를 반환
        const post = await Post.findByIdAndUpdate(id, ctx.request.body, {new: true,}).exec();
        if (!post) {
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    } catch (e) {
        ctx.throw(500, e);
    }
};