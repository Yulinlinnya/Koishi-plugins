import { Context, Schema, h } from 'koishi'

const path = require('path');

export const name = 'galwife'

export const usage = `**<center>无需配置，启用即可。</center>**`

export interface Config {
  每日轮换: boolean;
}

export const Config: Schema<Config> = Schema.intersect([
  Schema.object({
    每日轮换: Schema.boolean().default(true).description('※记录每日与她的邂逅(✿◠‿◠)'),
  }).description('扩展功能')
])

declare module 'koishi' {
  interface Tables {
    galgamewife: Galgamewife
  }
}

export interface Galgamewife {
  id: number
  user_time: string
  user_id: string
  user_wife: string
  wife_game: string
}

export async function apply(ctx: Context, config: Config) {
  //建表 
  ctx.model.extend("galgamewife", {
    id: 'unsigned',
    user_time: 'string',
    user_id: 'string',
    user_wife: 'string',
    wife_game: 'string',
  });

  async function randomwife () {
    const wifedata = {"ジュエリー・ハーツ・アカデミア -We will wing wonder world-": ["アリアンナ","ベルカ・トリアーデ","メア・アシュリーペッカー","ルビイ"],"ゆまほろめ　時を停めた館で明日を探す迷子たち": ["ミーナ","柴田奏子","川崎純麗","岩沼鈴"],"もののあはれは彩の頃。": ["クレア・コートニー・クレア","鬼無水みさき","琥珀","野々宮京楓"],"さくら、もゆ。-as the Night's, Reincarnation-": ["クロ","杏藤千和","夜月姫織","柊ハル"],"縁りて此の葉は紅に": ["斑鳩和羽","稜未小乃葉","木那里もみじ","笹浦すずな"],"さくらの雲＊スカアレットの恋": ["メリッサ","不知出遠子","水神蓮","所長"],"ふゆから、くるる。": ["熾火澱","菊間塔子","空丘夕陽","霜雪しほん","水名とりねこ","星都チエミ","宇賀島ベルリン","宇賀島ユカリ","月角島ヴィカ"],"まどひ白きの神隠し": ["稲白みこと","高乃椎凪","九十九千代","土御ろか"],"ねこツク、さくら。": ["ツキ","久慈恋花","上路弥生","穂高文乃"],"11月のアルカディア": ["三刀屋瀬奈","星崎心音","野々宮楓花","羽鳥愛瑠"],"あなたに恋する恋愛ルセット": ["白咲美絵瑠","大園柚姫","鍵由楓花","橘ののか"],"アンレス・テルミナリア": ["りな","ルチア＝ヴァリニャーノ","橘シャロン","御厨恋"],"ソラコイ": ["アイリ","ソラ","ナミ","ヒカリ"],"ハミダシクリエイティブ": ["常磐華乃","和泉妃愛","錦あすみ","鎌倉詩桜"],"保健室のセンセーとゴスロリの校医": ["オトヒメ"],"保健室のセンセーとシャボン玉中毒の助手": ["シロバナ"],"保健室のセンセーと小悪魔な会長": ["月森鈴"],"ネコ神さまと、ななつぼし -妹の姉-": ["青葉英梨歌"],"鍵を隠したカゴのトリ-Bird in cage hiding the key-": ["孔雀石透子","青葉梟みおん","瑞葉伊鶴","燕沢夜"],"空の青と白と／瞬きの夏": ["桧ノ原つぼみ"],"恋想リレーション": ["アリサ・ガーランド","千石唯華","桜坂由羽子","御厨陽葵"],"青い空のカミュ": ["オオモトサマ","三間坂蛍","込谷燐"],"若葉色のカルテット": ["アイ","ソフィア・クーゲル・ウェストリン","峰岸都","守谷ひより"],"乙女が紡ぐ恋のキャンバス ～二人のギャラリー～": ["鳳怜奈","猫西昭江","乾幸","獅子堂・千晴・フラムスティード","烏丸紫月"],"神頼みしすぎて俺の未来がヤバい。": ["坂白花夜","赤城鈴奈","麗","南雲七海","神林真央","周防由香里"],"神様のしっぽ ～干支神さまたちの恩返し～": ["あきら","あまね","あんこ","さゆり","じゅん","たかみ","ちづ","はるか","みそら","みゆき","浅葱蓮華"],"天気雨": ["こん","しろ"],"添いカノ 彼女と添い寝セット": ["花塚藍果","片桐つばめ","千雪灯子","熊倉夜明"],"星の乙女と六華の姉妹": ["九重純玲","茉莉花華恋","山吹ありす","梔子ネリネ"],"星降る夜のファルネーゼ": ["イブ・クライン","オリヒメ・N・アスティル","ジャクリーン・シュプレンガー","ファルネーゼ・アトラス"],"揺り籠のカナリア": ["君原結愛","藍野深織","美城ありす","小鳥遊紬","伊集院貴美香"]};
    const gameTitles = Object.keys(wifedata);
    const randomGameTitle = gameTitles[Math.floor(Math.random() * gameTitles.length)];
    const characters = wifedata[randomGameTitle];
    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
    return [randomCharacter,randomGameTitle];
  }

  ctx.command('galwife','娶二次元老婆').alias('/galwife').alias('/相遇').alias('相遇').action(async ({ session }) => {
    //亿些变量
    const user_id = session.userId;
    const user_data = await ctx.database.get("galgamewife", { user_id });
    const user_datas = await ctx.database.get("galgamewife", {});
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const date = currentDate.getDate();
    const user_Time = `${year}-${month}-${date}`;
    const [name, game] = await randomwife ();
    console.log(name, game);
    if (user_data.length == 0) {
      //用户不存在，创建用户并随机老婆
      await ctx.database.create("galgamewife", { id: user_datas.length + 1, user_time: user_Time, user_id: user_id, user_wife: name, wife_game: game});
      return `<><img src="https://gitee.com/rain-linlin/galwife/raw/master/data/${name}.jpg"/>\n今日邂逅的少女是「${name}」，相遇于『${game}』。\n今天也是美好的一天！</>`;
    }
    else {
      if (user_data?.[0]?.user_time == user_Time) {
        const Wife_name = (await ctx.database.get("galgamewife", { user_id: user_id }))[0]?.user_wife;
        const Wife_Game = (await ctx.database.get("galgamewife", { user_id: user_id }))[0]?.wife_game;
        return `<><img src="https://gitee.com/rain-linlin/galwife/raw/master/data/${Wife_name}.jpg"/>\n劳累了一整天，休息一下吧！\n今日邂逅的少女是「${Wife_name}」，相遇于『${Wife_Game}』。</>`;
      }
      else {
        //重新随机
        await ctx.database.set("galgamewife", { user_id: user_id }, { user_time: user_Time, user_wife: name, wife_game:game});
        return `<><img src="https://gitee.com/rain-linlin/galwife/raw/master/data/${name}.jpg"/>\n今日邂逅的少女是「${name}」，相遇于『${game}』。\n今天也是美好的一天！</>`;
      }
    }
  });
}