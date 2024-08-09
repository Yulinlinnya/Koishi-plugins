import { Context, Schema } from 'koishi'

export const name = 'friendship_link'

exports.usage = "**<center>友情链接</center>**";

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.command('友情链接', '糖云狐和她的朋友们').alias('/友情链接').action(async ({ session }) => {
    const md = {
      "content": "111",
      "msg_type": 2,
      "keyboard": {
        "id": "102076734_1721914596"
      },
      "msg_id": session.messageId,
      "timestamp": session.timestamp,
      "msg_seq": Math.floor(Math.random() * 1000000)
    };
    try {
      await session.bot.internal.sendMessage(session.channelId, md);
      return `糖云狐和她的朋友们。`;
    }
    catch (e) {
      return `网络请求超时。`;
    }
  });
}
