import { Context, Schema, } from 'koishi'
import { } from 'koishi-plugin-puppeteer'
import { } from 'koishi-plugin-cron'

const path = require('path');

export const name = 'stormgate-plugin'

export const inject = ['database', 'puppeteer', 'cron'];

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

declare module 'koishi' {
  interface Tables {
    stormgate_ranked: Stormgate_ranked
  }
}
export interface Stormgate_ranked {
  id: number
  data: {
    league: string
    losses: number
    mmr: number
    points: number
    race: string
    tier: number
    ties: number
    wins: number
    playerName: string
    profileId: string
  }
  model: string
}
export function apply(ctx: Context) {
  ctx.model.extend("stormgate_ranked", {
    id: 'unsigned',
    data: 'json',
    model: 'string'
  });
  async function getdata(matchMode: string) {
    const apiURL = `https://api.stormgate.untapped.gg/api/v1/leaderboard?match_mode=${matchMode}`;
    try {
      let response = await ctx.http.get(apiURL);
      const players = await ctx.database.get('stormgate_ranked', {model: matchMode}, {});
      for (let i = 0; i < response.length; i++) {
        if (players.length == 0) {
          await ctx.database.create('stormgate_ranked', { id: i + 1, data: response[i], model: matchMode});
        }
        else {
          await ctx.database.set('stormgate_ranked', {id: i + 1, model: matchMode},{data: response[i]});
        }
      }
    }
    catch(e){
      ctx.logger.error("数据请求失败，请检查网络环境。");
    }
  }
  async function getrank(Data) {
    let msg = "";
    for (let i = 0; i < Data.length; i++) {
      const {id, model} = Data[i];
      const {league, losses, mmr, points, race, tier, ties, wins, playerName, profileId}=Data[i].data;
      const img_league = path.resolve(__dirname, `./img/${league}${tier}.webp`);
      const img_race = path.resolve(__dirname, `./img/${race}_solid.webp`);
      const winrate = Math.round(wins / (losses + wins) * 100);
      const text = `
<div style="height:20px; margin: 0px; display: grid; grid-template-columns: 30px 200px 65px 60px 80px 50px; justify-items: center; align-items: center; border-bottom: 1px solid black;">
  <p style="margin: 0px; font-size: 10px; font-weight: bold; color: rgb(255,255,255);">${id}</p>
  <div style="width: 100%; display:flex; flex-direction:row; justify-content: center; align-items: center;">
    <img style="margin: 1px; width: 15px;" src="${img_race}">
    <p style="margin: 0px; font-size: 10px; font-weight: bold; color: rgb(255,255,255);">${playerName}</p>
  </div>
  <div style="width: 100%; display:flex; flex-direction:row; justify-content: center; align-items: center;">
    <img style="margin: 0px; width: 20px;" src="${img_league}">
    <p style="margin: 0px; font-size: 10px; font-weight: bold; color: rgb(255,255,255);">${points}</p>
  </div>
  <p style="margin: 0px; font-size: 10px; font-weight: bold; color: rgb(255,255,255);">${mmr}</p>
  <div style="width: 100%; display:flex; flex-direction:row; justify-content: center; align-items: center;">
    <p style="margin: 0px; font-size: 10px; font-weight: bold; color: rgb(0,255,0);">${wins}</p>
    <p style="margin: 0px; font-size: 10px; font-weight: bold; color: rgb(255,255,255);">-</p>
    <p style="margin: 0px; font-size: 10px; font-weight: bold; color: rgb(255,0,0);">${losses}</p>
  </div>
  <p style="margin: 0px; font-size: 10px; font-weight: bold; color: rgb(255,255,255);">${winrate}%</p>
</div>
`;
      msg += text;
    }
    return msg;
  }
  async function getmsg(all_data, text, date) {
    const img_bg = path.resolve(__dirname, `./img/sgimba_bg.jpg`);
    let celestialscount = 0;
    let infernalscount = 0;
    let vanguardcount = 0;
    all_data.forEach(item => {
      if (item.data.race === "celestials")
        celestialscount++;
      if (item.data.race === "infernals")
        infernalscount++;
      if (item.data.race === "vanguard")
        vanguardcount++;
    });
    const celestialsmath = Math.round(celestialscount / 500 * 100);
    const infernalsmath = Math.round(infernalscount / 500 * 100);
    const vanguardmath = Math.round(vanguardcount / 500 * 100);
    const vimath = vanguardmath + infernalsmath;
    let res = await ctx.puppeteer.render(`<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="width: 500px; height: 2495px; margin: 0; background-color: rgb(170,185,203);">
  <img style="margin: 0px; position: absolute; z-index: -1;" src="${img_bg}">
  <div style="width: 100%; display: flex; display:flex; flex-direction:row; flex-direction: column; justify-content: center;">
    <div style="margin-top: 120px; height: 55px;">
      <p style="margin: 0px; text-align: center; font-size: 20px; font-weight: bold;-webkit-text-stroke:0.8px rgba(255, 102, 0); color: rgb(255,255,255); text-shadow: 1px 1px 2px rgb(0,0,0);">风暴之门排行榜<br>Ranked_1v1</p>
    </div>
    <div style="margin: 10px 1.5%; height: 150px;display:flex; flex-direction:row; border-radius: 5px; background-color: rgb(255,255,255,0.5); backdrop-filter: blur(5px);">
      <div style="margin: 20px; width: 60%;display:flex; flex-direction:column; justify-content: center;">
        <p style="margin: 2.5px 0px;font-size: 15px; color: rgb(255,255,255); font-weight: bold; -webkit-text-stroke:0.6px rgba(0,0,0);">截止至${date}</br>天梯五百强统计数据如下：</p>
        <p style="margin: 2.5px 0px;font-size: 15px; color: rgb(255,255,255); font-weight: bold; -webkit-text-stroke:0.6px rgba(0,0,128);">先锋${vanguardcount}名选手，占比${vanguardmath}%</p>
        <p style="margin: 2.5px 0px;font-size: 15px; color: rgb(255,255,255); font-weight: bold; -webkit-text-stroke:0.6px rgba(128,0,0);">地狱${infernalscount}名选手，占比${infernalsmath}%</p>
        <p style="margin: 2.5px 0px;font-size: 15px; color: rgb(255,255,255); font-weight: bold; -webkit-text-stroke:0.6px rgba(128,0,128);">天贤${celestialscount}名选手，占比${celestialsmath}%</p>
      </div>
      <div style="width: 40%; display:flex; flex-direction:column; justify-content: center; align-items: center;">
        <div style="width: 125px; height:125px; border-radius:50%; background: conic-gradient(rgb(0,0,188) 0% ${vanguardmath}%,rgb(188,0,0) ${vanguardmath}% ${vimath}%,rgb(188,0,188) ${vimath}% 100%);"></div>
        <p style="margin: 1px 0px;font-size: 7.5px; color: rgb(255,255,255);">祝各位早日上宗师！</p>
      </div>
    </div>
    <div style="height:2140px; margin: 0px 1.5%; display: grid; grid-template-columns: 485px; grid-template-rows: repeat(302, 20px); justify-items: center; align-items: center; gap: 1px;background-color: rgb(0,0,0, 0.5); backdrop-filter: blur(5px); border-radius: 5px;">
      <div style="height:20px; margin: 0px; display: grid; grid-template-columns: 30px 200px 65px 60px 80px 50px; justify-items: center; align-items: center; border-bottom: 1px solid black;">
        <p style="margin: 0px; font-size: 10px; font-weight: bold; color: rgb(140,169,187);">排名</p>
        <p style="margin: 0px; font-size: 10px; font-weight: bold; color: rgb(140,169,187);">玩家</p>
        <p style="margin: 0px; font-size: 10px; font-weight: bold; color: rgb(140,169,187);">段位分</p>
        <p style="margin: 0px; font-size: 10px; font-weight: bold; color: rgb(140,169,187);">匹配分</p>
        <p style="margin: 0px; font-size: 10px; font-weight: bold; color: rgb(140,169,187);">对局统计</p>
        <p style="margin: 0px; font-size: 10px; font-weight: bold; color: rgb(140,169,187);">胜率</p>
      </div>
      ${text}
      <div>
        <p style="margin: 0px; font-size: 7.25px; font-weight: bold; color: rgb(140,169,187);">数据更新可能存在延迟，刚结束的对局请稍后查询。</p>
      </div>
    </div>
  </div>
</body>
</html>
    `);
    return res;
  }
  let data_time, year, month, date, hours, minutes, seconds;
  ctx.cron('*/2 * * * *' , async () => {
    await getdata("ranked_1v1");
    data_time = new Date();
    year = data_time.getFullYear();
    month = data_time.getMonth() + 1;
    date = data_time.getDate();
    hours = data_time.getHours();
    minutes = data_time.getMinutes();
    seconds = data_time.getSeconds();
  });
  ctx.command('sgimba','看哪个族更imba').alias('/sgimba').action(async ({ session }) => {
    const all_data = await ctx.database.get('stormgate_ranked', {model: "ranked_1v1"});
    const rank_top = all_data.slice(0,100);
    const text = await getrank(rank_top);
    const time = `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`;
    const res = await getmsg(all_data, text, time);
    try {
      return res;
    }
    catch (e) {
      return "网络错误，请稍后重试。";
    }
  });
}