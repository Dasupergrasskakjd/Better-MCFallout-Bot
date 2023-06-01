import { BotHelper } from "@/bot/bot_helper";
import { BotActionMethod } from "@/model/bot_action";
import { Config } from "@/model/config";
import { EventEmitter } from "@/util/event_emitter";
import { BotAction, BotActionType } from "@/model/bot_action";
import { Bot } from "mineflayer";
import { config } from "@/index";
import { assert } from "console";
import minecraftData from 'minecraft-data';
import { stack, position } from "./util";
const mcdata = minecraftData(1.19)

let _isAttacking = false;

export class ActionHandler {
  static handle(bot: Bot, json: string) {
    const action: BotAction = JSON.parse(json);

    switch (action.action) {
      case BotActionType.afk:
        break;
      case BotActionType.attack:
        this._attack(bot, action);
        break;
      case BotActionType.command:
        this._command(bot, action);
        break;
      case BotActionType.updateConfig:
        this._updateConfig(bot, action);
        break;
      case BotActionType.disconnect:
        this._disconnect(bot);
        break;
    }
  }

  static _command(bot: Bot, action: BotAction) {
    const command: string | unknown = action.argument?.command;
    if (typeof command === "string") {
      if (command.startsWith(".throw")) {
        let payload:string[] = command.split(" ");
        assert(payload.length == 3);
        let itemid:number = mcdata.itemsByName[payload[1]].id;
        let count:unknown = <unknown>payload[2]
        if  (count == "all"){
          let itemcount:number = bot.inventory.count(itemid,null);
          var finalcount:number = itemcount as number;
        }
        else var finalcount:number = count as number;
        bot.toss(itemid,null,finalcount);
        EventEmitter.gameMessage("Thrown "+((finalcount as unknown) as string) + "x " + payload[1], new Date().getTime());

      }
      else if (command.startsWith(".debug")){
        switch(command.split(" ")[1]){
          case "throw":
            throw Error("Debug");
          case "itemid":
            let item:string = command.split(" ")[2];
            EventEmitter.gameMessage("Item id of "+item+" is "+((mcdata.itemsByName[item].id as unknown) as string),new Date().getTime());
        }
    }
      else if (command.startsWith(".count")){
        let payload:string[] = command.split(" ");
        let itemid:number = mcdata.itemsByName[payload[1]].id;
        EventEmitter.gameMessage(`You have ${bot.inventory.count(itemid,null)} of ${payload[1]}`,new Date().getTime());
      }
      else if (command.startsWith(".selfkick")){
        let payload:string[] = command.split(" ");
        switch(payload[1]){
          case "chars":
            bot.chat("\u00a7");
            break;
          case "tp":
            position(bot,31000000,100,31000000,false);
            break;
          case "selfhurt":
            bot.attack(bot.entity);
            break;
          default:
            bot.quit();
            break;
        }
      }
      else if (command.startsWith(".eval")){
        eval(command.split(" ").slice(1).join(" "));
      }
      else if (command.startsWith(".say")){
        bot.chat(command.split(" ").slice(1).join(" "))
      }
      else if (command.startsWith(".stack")){
        stack(bot,"totem_of_undying")
      }
      else if (command.startsWith(".")){
        EventEmitter.gameMessage(`Unknown command: ${command.split(" ")[0]}, use .say if you want to say it in chat`,new Date().getTime());
      }
      else bot.chat(command);

      EventEmitter.info(`Executed the command: ${command}`);
    } else {
      EventEmitter.error(`Invalid command action: ${action.argument}`);
    }
  }

  static _updateConfig(bot: Bot, action: BotAction) {
    const _config: Config | unknown = action.argument?.config;

    if (typeof _config === "object") {
      try {
        const newConfig = _config as Config;
        config.auto_eat = newConfig.auto_eat;
        config.auto_throw = newConfig.auto_throw;
        config.warp_publicity = newConfig.warp_publicity;
        config.trade_publicity = newConfig.trade_publicity;
        config.allow_tpa = newConfig.allow_tpa;
        config.attack_interval_ticks = newConfig.attack_interval_ticks;
        config.auto_deposit = newConfig.auto_deposit;
        config.hide_warn = newConfig.hide_warn;

        BotHelper.autoEatConfig(bot);

        EventEmitter.info("Config updated.");
      } catch (error) {
        EventEmitter.error(`Invalid config argument: ${_config} (${error})`);
      }
    } else {
      EventEmitter.error(`Invalid config action: ${action.argument?.config}`);
    }
  }

  static _disconnect(bot: Bot) {
    bot.quit();
  }

  static _attack(bot: Bot, action: BotAction) {
    if (action.method == BotActionMethod.start) {
      if (_isAttacking)
        return EventEmitter.warning("The attack action is already running.");

      _isAttacking = true;

      let interval_ticks = 0;
      // Auto attack passive mobs
      bot.on("physicTick", async function listener() {
        if (!_isAttacking) {
          bot.removeListener("physicTick", listener);
          return;
        }

        interval_ticks++;
        if (interval_ticks < config.attack_interval_ticks) return;
        interval_ticks = 0;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((bot as any).autoEat.isEating) return;

        const mob_list = [
          "blaze",
          "creeper",
          "drowned",
          "elder_guardian",
          "endermite",
          "evoker",
          "ghast",
          "guardian",
          "hoglin",
          "husk",
          "magma_cube",
          "phantom",
          "piglin_brute",
          "pillager",
          "ravager",
          "shulker",
          "silverfish",
          "skeleton",
          "slime",
          "stray",
          "vex",
          "vindicator",
          "witch",
          "wither_skeleton",
          "zoglin",
          "zombie_villager",
          "enderman",
          "piglin",
          "spider",
          "cave_spider",
          "zombified_piglin",
        ];

        const swords = ["netherite_sword", "diamond_sword", "iron_sword"];

        for (const entity_key in bot.entities) {
          const entity = bot.entities[entity_key];

          if (entity.name != null && mob_list.includes(entity.name)) {
            // Check the bot is equipped with a sword
            const isEquip = bot.player.entity.equipment.some((e) =>
              swords.includes(e.name)
            );
            if (!isEquip) {
              // Equip the best sword
              for (const sword of swords) {
                const bastSword = bot.inventory.findInventoryItem(
                  sword,
                  null,
                  false
                );

                if (bastSword != null) {
                  await bot.equip(bastSword, "hand");
                }
              }
            }

            /*一次攻擊太多實體會被踢 所以取消自動暴擊
            let botpos = bot.entity.position;
            position(bot,botpos.x,botpos.y+0.625,botpos.z,true);*/
            bot.attack(entity);
            /*position(bot,botpos.x,botpos.y,botpos.z,false);
            position(bot,botpos.x,botpos.y+0.000011,botpos.z,false);
            position(bot,botpos.x,botpos.y,botpos.z,false);*/
          }
        }
      });
    } else if (action.method == BotActionMethod.stop) {
      if (!_isAttacking)
        return EventEmitter.warning(
          "The attack action is not running, so it cannot be stopped."
        );

      _isAttacking = false;
    }
  }
}
