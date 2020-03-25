import Post from '../../models/post';
import mongoose from 'mongoose';
import Joi from 'joi';

const {ObjectId} = mongoose.Types;

export const checkObjectId = (ctx, next) => {
    const {id} = ctx.params;
    if (!ObjectId.isValid(id)) {
        ctx.status = 400;
        return;
    }
    return next();
}

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
    const schema = Joi.object().keys({
        // 객체가 다음 필드를 가지고 있음을 검증
        title: Joi.string().required(), // required()가 있으면 필수 항목
        body: Joi.string().required(),
        tags: Joi.array()
            .items(Joi.string())
            .required(),
    })

    // 검증하고 나서 검증 실패인 경우 에러 처리
    const result = Joi.validate(ctx.request.body, schema);
    if (result.error) {
        ctx.status = 400; // Bad Request
        ctx.body = result.error;
        return;
    }

    const {title, body, tags} = ctx.request.body;
    const post = new Post({
        title, body, tags
    });
    try {
        await post.save();
        ctx.body = post;
    } catch (e) {
        ctx.throw(500, e);
    }
}

/**
 * GET /api/posts
 *
 * @param ctx
 * @returns {Promise<void>}
 */
export const list = async ctx => {
    const page = parseInt(ctx.query.page || '1', 10);

    if (page < 1) {
        ctx.status = 400;
        return;
    }

    try {
        // sort({_id: -1}) : _id 를 역순으로 정렬
        // limit(10) : 10개씩 보이는 개수 제한
        // skip((page - 1) * 10) : 1페이지 일 경우 skip(0), 2페이지 일 경우 skip(10)
        const posts = await Post.find().sort({_id: -1}).limit(10).skip((page - 1) * 10).exec();
        const postCount = await Post.countDocuments().exec();
        ctx.set('Last-Page', Math.ceil(postCount / 10));
        ctx.body = posts.map(post => post.toJSON()).map(post => ({
            ...post,
            body: post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`
        }));
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
    // write에서 사용한 schema와 비슷한데, required()가 없습니다.
    const schema = Joi.object().keys({
        title: Joi.string(),
        body: Joi.string(),
        tags: Joi.array().items(Joi.string()),
    });
    // 검증하고 나서 검증 실패인 경우 에러 처리
    const result = Joi.validate(ctx.request.body, schema);
    if (result.error) {
        ctx.status = 400; // Bad Request
        ctx.body = result.error;
        return;
    }

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