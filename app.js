const Koa = require("koa");
const Router = require("koa-router");
const qs = require("qs");
const axios = require("axios");
const querystring = require("querystring");
const clientId = "4d4abac4ad899c67219a";
const clientSecret = "d964bbe767c8c52a65cefd37a4db26cdd56f5c86";

const app = new Koa();
const router = new Router();
router.get("/", async (ctx) => {
  ctx.body = `
    <h1>获取github第三方授权的内容</h1>
    <p>这是一个获取获取github第三方授权的内容的demo</p>
    <a href='/github/login'>github</a>
    `;
});
router.get("/github/login", async (ctx) => {
  let url = `https://github.com/login/oauth/authorize?client_id=${clientId}`;
  console.log(url);
  //重定向到github认证接口
  ctx.redirect(url);
});
router.get("/github/callback", async (ctx) => {
  console.log(ctx);
  const code = ctx.query.code;
  let res = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
    }
  );
  let access_token = querystring.parse(res.data).access_token;
  let user_info = await axios.get(
    `https://api.github.com/user?access_token=${access_token}`
  );
  console.log(user_info.data)
  let { login, avatar_url, bio, html_url } = user_info.data;
  ctx.body = `
    <h2>你好${login}</h2>
    <img width="50" src="${avatar_url}"/>
    <p>介绍${bio}</p>
    <p>git主页${html_url}</p>
    <p>所有信息${JSON.stringify(user_info.data)}</p>
    `;
});
app.use(router.routes()).use(router.allowedMethods);
app.listen(3000, () => {
  console.log("web服务启动成功");
});
