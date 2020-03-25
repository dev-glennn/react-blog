import jwt from 'jsonwebtoken';

const jwtMiddlewate = (ctx, next) => {
    const token = ctx.cookies.get('access_token');
    if (!token) return next(); //토큰이 없음
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        ctx.state.user = {
            _id: decoded._id,
            username: decoded.username,
        }
        console.log(decoded);
        return next();
    } catch (e) {
        return next();
    }
};

export default jwtMiddlewate;