import { Context, Schema } from 'koishi'

export const name = 'cats-and-dogs'

exports.usage = "**<center>(尖叫)(扭曲)(阴暗的爬行) (爬行)(扭动)(阴暗地蠕动)(翻滚)(激烈地爬动)(扭曲)(痉挛)(嘶吼)(蠕动)(阴森的低吼)(爬行)(分裂)(走上岸)(扭动)(痉挛)(蠕动)(扭曲的行走)(不分对象攻击)</center>** <center>祖传代码<center>";

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.command('来只小可爱 <animal:text>', '随机一张动物图片').alias('/来只小可爱').action(async ({ session }, animal) => {
    const animals = ["猫猫","狗狗","狐狸"];
    let inputanimal = animal == null ? animals[Math.floor(Math.random() * animals.length)] : animal;
    const inputfox = ["狐狸","小狐狸","🦊","大狐狸","狐","狐狐","fox","Fox","哈基狐"];
    const inputcat = ["猫","小猫","🐱","大猫猫","大猫","猫猫","cat","Cat","哈基米"];
    const inputdog = ["狗","小狗","🐶","大狗狗","大狗","狗狗","dog","Dog","哈基旺","旺财"];
    if (inputfox.includes(inputanimal)) {
      try {
        let number = Math.floor(Math.random() * 123) + 1;  
        return `<><img src="https:\/\/randomfox.ca\/images\/${number}.jpg"/>\n毛茸茸的狐狸尾巴来咯~\n可选【🦊 🐱 🐶】</>`;
      }
      catch (e) {
        return `<>呜，小狐狸逃进森林深处啦！</>`;
      }
    }
    if (inputcat.includes(inputanimal)) {
      try {
        const apiURL = `https://api.thecatapi.com/v1/images/search?limit=1`;
        let response = await ctx.http.get(apiURL);
        let [{id, url, width, height}] = response;
        return `<><img src="${url}"/>\n猫猫的粉爪爪肉嘟嘟的~\n可选【🦊 🐱 🐶】</>`;
      }
      catch (e) {
        return `<>呜，猫猫挺怕生，不敢出来。</>`;
      }
    }
    if (inputdog.includes(inputanimal)) {
      try {
        const apiURL = `https://api.thedogapi.com/v1/images/search?limit=1`;
        let response = await ctx.http.get(apiURL);
        let [{id, url, width, height}] = response;
        return `<><img src="${url}"/>\n狗狗是人类的好朋友~\n可选【🦊 🐱 🐶】</>`;
      }
      catch (e) {
        return `<>呜，狗狗好像在忙的样子~</>`;
      }
    }
    if ((!(inputfox.includes(inputanimal))) || (!(inputcat.includes(inputanimal))) || (!(inputdog.includes(inputanimal)))) {
      return `<>呜，糖云没有这种动物的图片，请检查输入是否有误。可选【🦊 🐱 🐶】</>`;
    }
  });
}
