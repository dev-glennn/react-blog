import Router from 'koa-router';
import * as authCtrl from './auth.ctrl';

const auth = new Router();

auth.post('/register', authCtrl.register);
auth.post('/login', authCtrl.register);
auth.get('/check', authCtrl.register);
auth.post('/logout', authCtrl.register);

export default auth;