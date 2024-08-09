import { Context, Schema } from 'koishi'

export const name = 'cats-and-dogs'

exports.usage = "**<center>(尖叫)(扭曲)(阴暗的爬行) (爬行)(扭动)(阴暗地蠕动)(翻滚)(激烈地爬动)(扭曲)(痉挛)(嘶吼)(蠕动)(阴森的低吼)(爬行)(分裂)(走上岸)(扭动)(痉挛)(蠕动)(扭曲的行走)(不分对象攻击)</center>** <center>祖传代码<center>";

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.command('nyaa', '来只猫咪').alias('来只猫').alias('/来只猫').action(async ({ session }) => {
    const apiURL = `https://api.thecatapi.com/v1/images/search?limit=1`;
    try {
      let response = await ctx.http.get(apiURL);
      let [{id, url, width, height}] = response;
      return `<>可爱的哈基米来啦，是不是很喜欢呢？\n<img src="${url}"/></>`;
    }
    catch (e) {
      return `<>网络请求超时。/></>`;
    }
  });
  ctx.command('wanwan', '来只狗狗').alias('来只狗').alias('/来只狗').action(async ({ session }) => {
    const apiURL = `https://api.thedogapi.com/v1/images/search?limit=1`;
    try {
      let response = await ctx.http.get(apiURL);
      let [{id, url, width, height}] = response;
      return `<>狗狗是人类的好朋友，是不是很可爱呢？\n<img src="${url}"/></>`;
    }
    catch (e) {
      return `<>网络请求超时。/></>`;
    }
  });

  ctx.command('huli', '来只狐狸').alias('来只狐狸').alias('/来只狐狸').alias('/来只狐').alias('来只狐').action(async ({ session }) => {
    let shuzi = Math.floor(Math.random() * 123) + 1;  
    return `<>（看不到图片说明上传超时）\n狐狸的大尾巴很柔软呢，是不是很可爱呢？<img src="https:\/\/randomfox.ca\/images\/${shuzi}.jpg"/></>`;
  });
}
