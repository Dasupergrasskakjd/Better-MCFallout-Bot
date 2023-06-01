import { Bot } from "mineflayer";
import minecraftData from "minecraft-data";
const mcdata = minecraftData('1.19')
export class Util {
  static delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export function position(bot:Bot,x:number|undefined=undefined,y:number|undefined=undefined,z:number|undefined=undefined,onGround:boolean|undefined=undefined){
  bot._client.write(
    "position",{
      x:x ? x : bot.entity.position.x,
      y:y ? y : bot.entity.position.y,
      z:z ? z : bot.entity.position.z,
      onGround:(onGround != undefined) ? onGround : bot.entity.onGround
    }
  )
}

export async function stack(bot:Bot,itemname:string){
  let xyz = bot.entity.position.offset(0,-1,0);
  const itemid = mcdata.itemsByName[itemname].id;
  bot.equip(itemid,null);
  bot.controlState['sneak'] = true
  bot._client.write(
    "block_dig",
    {
      status:0,
      location:xyz,
      face:1
    }
  );
  await Util.delay(2000);
  bot._client.write(
    "block_dig",
    {
      status:1,
      location:xyz,
      face:1
    }
  );
  bot.controlState['sneak'] = false;
}