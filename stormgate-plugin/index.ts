import { Context, Schema } from 'koishi'

export const name = 'stormgate-plugin'

export const usage = `
# <center>风暴要🔥</center>
**<center>今后将根据api更改进行更新。</center>**
`

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

declare module 'koishi' {
  interface Tables {
    stormgate: Stormgate
  }
}

export interface Stormgate {
  id: number
  user_id: string
  playerName: string
  profileId: string
}

export function apply(ctx: Context) {
  //建表
  ctx.model.extend("stormgate", {
    id: 'unsigned',
    user_id: 'string',
    playerName: 'string',
    profileId: 'string',
  });

  async function getplayer(playerName) {
    //用于搜索玩家的api
    const apiURL = `https://api.stormgate.untapped.gg/api/v1/players?q=${playerName}`;
    try {
      let response = await ctx.http.get(apiURL);
      return response;
    }
    catch(e){
      return null;
    }
  }
  async function getplayerdata(profileId) {
    //用于查询玩家战绩的api
    const apiURL = `https://api.stormgate.untapped.gg/api/v1/players/${profileId}`;
    try {
      let response = await ctx.http.get(apiURL);
      return response;
    }
    catch(e){
      return null;
    }
  }
  async function getdata() {
    //用于查询天梯五百强的api
    const apiURL = `https://api.stormgate.untapped.gg/api/v1/leaderboard?match_mode=ranked_1v1`;
    try {
      let response = await ctx.http.get(apiURL);
      return response;
    }
    catch(e){
      return null;
    }
  }

  ctx.command('sg绑定 <playerName>','绑定风暴之门至untapped.gg').alias('/sg绑定').action(async ({ session }, playerName) => {
    const user_id = session.userId;
    const user_data = await ctx.database.get("stormgate", { user_id });
    const user_datas = await ctx.database.get("stormgate", {});
    try {
      if (user_data.length == 0) {
        let data = await getplayer(playerName);
        if (data.length == 1) {
          const profileId = data[0].profileId;
          await ctx.database.create("stormgate", { id: user_datas.length + 1, user_id: user_id, playerName: playerName,profileId: profileId});
          return "绑定成功！";
        }
        else {
          return "请使用「名称#鉴别器」重新绑定。\n例：@机器人 /sg绑定 Дождь#5387";
        }
      }
      else {
        return "您已绑定，无需重复绑定。\n如需解绑，请@机器人 /sg解除绑定";
      }
    }
    catch (e) {
      return "网络请求超时，请重新绑定。";
    }
  });

  ctx.command('sg查分','查询天梯分').alias('/sg查分').action(async ({ session }, Race) => {
    const translate_en = {
      "vanguard": ["人族","人类","人族先锋","人类先锋","泰伦","人","先锋","vanguard","Vanguard","v","V","t","T"],
      "infernals": ["地狱宿主","恶魔宿主","恶魔","地狱","魔族","魔","宿主","地狱族","恶魔族","infernals","Infernals","i","I","z","Z","炎魔"],
      "celestials": ["天界舰队","天使舰队","天神舰队","天人舰队","舰队","天使","天使族","天界","天人族","天族","神族","神人","天神族","天神","神使","celestials","Celestials","C","c","p","P","天贤"]
    };
    const translate_zh = {
      "vanguard": "先锋",
      "infernals": "炎魔",
      "celestials": "天贤",
      "null": "无段位",
      "aspirant": "新手",
      "bronze": "青铜",
      "silver": "白银",
      "gold": "黄金",
      "platinum": "铂金",
      "diamond": "砖石",
      "master": "宗师"
    };
   function findKey(value) {
      for (const [key, values] of Object.entries(translate_en)) {
        if (values.includes(value)) {
          return key;
        }
      }
      return null; // 如果没有匹配结果，返回null
    }
    const race = findKey(Race);
    const profileId = (await ctx.database.get("stormgate", { user_id: session.userId }))[0]?.profileId;
    try {
      if (profileId != undefined) {
        if (race == null) {
          const md = {
            "content": "111",
            "msg_type": 2,
            "keyboard": {
              "id": "102076734_1721915468"
            },
              "msg_id": session.messageId,
              "timestamp": session.timestamp,
              "msg_seq": Math.floor(Math.random() * 1000000)
          };
          await session.bot.internal.sendMessage(session.channelId, md);
          return;
        }
        else {
          let data = await getplayerdata(profileId);
          let {league, losses, mmr, points, season, tier, ties, wins} = data.ranks.ranked_1v1[race];
          const league_zh = translate_zh[league];
          const Race_zh = translate_zh[race];
          const wp = Math.round(wins/(losses+ties+wins)*100)/100;
          return `这是你的查询结果\n╔══════════\n╠ 种族：${Race_zh}\n╠ 模式：1v1\n╠══════════\n╠ mmr：${mmr}\n╠ 点数：${points}\n╠ 段位：${league_zh}${tier}\n╠ 赛季：${season}   胜率：${wp}\n╠ 负场：${losses}   胜场：${wins}\n╚══════════`;
        }
      }
      else {
        return "你还没有绑定！\n绑定示例：@机器人 /sg绑定 Дождь#5387";
      }
    }
    catch (e) {
      return "网络请求超时，请重新查询。";
    }
  });

  ctx.command('sgimba','看哪个族更imba').alias('/sgimba').action(async ({ session }) => {
    const translate_zh = {
      "vanguard": "😎先锋",
      "infernals": "😈炎魔",
      "celestials": "😇天贤"
    };
    try {
      let data = await getdata();
      let celestialscount = 0;
      let infernalscount = 0;
      let vanguardcount = 0;
      data.forEach(player => {
        if (player.race === "celestials") celestialscount++;
        if (player.race === "infernals") infernalscount++;
        if (player.race === "vanguard") vanguardcount++;
      });
      let top10 = data.slice(0, 10);
      let result = "";
      for (let i = 0;i < top10.length; i++) {
        const obj = data[i];
        const race_zh = translate_zh[obj.race];
        result += `╠ No.${i + 1}「${race_zh}」${obj.playerName}\n`;
      }
      let celestialsmath = Math.round(celestialscount / 500 * 100);
      let infernalsmath = Math.round(infernalscount / 500 * 100);
      let vanguardmath = Math.round(vanguardcount / 500 * 100);
      return `截止至目前\n╔══════════════\n╠ 1v1五百强排行榜：\n╠══════════════\n╠ 先锋：共有${vanguardcount}位，占比${vanguardmath}%\n╠ 炎魔：共有${infernalscount}位，占比${infernalsmath}%\n╠ 天贤：共有${celestialscount}位，占比${celestialsmath}%\n╠══════════════\n五百强前十名选手：\n╠══════════════\n${result}╚══════════════`;
    }
    catch (e) {
      return "网络请求超时，请重新查询。";
    }
  });

  ctx.command('sg解除绑定','解除untapped.gg绑定').alias('/sg解除绑定').action(async ({ session }) => {
    const user_id = session.userId;
    const user_data = await ctx.database.get("stormgate", { user_id });
    const user_datas = await ctx.database.get("stormgate", {});
    if (user_data.length == 1) {
      await ctx.database.remove("stormgate", { id: user_datas.length});
      return "解除绑定成功！";
    }
    else {
      return "你还没有绑定！\n绑定示例：@机器人 /sg绑定 Дождь#5387";
    }
  });
}