import { Context, Schema, h } from 'koishi'

export const name = 'qq-like'

export const usage = `
# <center>✨快去给好友点赞吧✨</center>

**<center>无需配置，启用即可。自定义回复请前往本地化。</center>**

点赞失败的原因：用户禁止陌生人赞我，今日点赞已达上限，网络超时等。

陌生人可以点赞50次，svip用户可以点赞20次，普通用户可以点赞10次

~~点不了再加好友，实现点赞最大化~~
`

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.i18n.define('zh-CN', require('./zh-CN'));
  ctx.command('qq-like', '给好友点赞！').alias('赞我').alias('点赞').action(async ({ session }) => {
    let n = 0;
    try {
      for (let i = 0; i < 5; i++) {
        await session.bot.internal.sendLike(session.userId, 10);
        n = (i+1)*10;
      }
      return session.text('.a', {quote: h.quote(session.messageId), n});
    } catch (error) {
      if (n > 0) {
        return session.text('.b', {quote: h.quote(session.messageId), n});
      }
      else {
        return session.text('.c', {quote: h.quote(session.messageId)});
      }
    }
  });
}