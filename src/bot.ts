import {
  ActivityGroupLoader,
  ActivityManager,
  checkLogin,
  Cocoa,
} from "cocoa-discord";
import { SlashCenter } from "cocoa-discord/slash";
import { CocoaIntent } from "cocoa-discord/template";
import { Client } from "discord.js";

import { MainSlashModule } from "./commands/main.slash.js";
import { style } from "./commands/styles.js";
import { environment } from "./environment.js";

const client = new Client(new CocoaIntent().useGuild());

const scenter = new SlashCenter(client, [environment.GUILD_ID]);

// ? Edit data/activites.json to customize, or delete this line to not use activities
const activity = new ActivityGroupLoader("data/activities.json");

scenter.addModules(new MainSlashModule());
scenter.useHelpCommand(style);
scenter.on("error", async (name, err, ctx) => {
  Cocoa.log(
    `Command ${name} invoked by ${ctx.user.tag} encounter error at ${ctx.guild?.name}: ${err}`,
  );
  if (ctx.channel?.isSendable()) {
    await ctx.channel.send(`Sorry, error occured: ${err}`);
  }
});

const activityManager = new ActivityManager(activity, client);

client.on("ready", (cli) => {
  console.log(
    `Logged in as ${cli.user.tag}, took ${process.uptime().toFixed(3)} seconds`,
  );
  scenter.syncCommands();
  activityManager.nextActivity();
});

let exitHandled = false;
async function handleExit(type: string) {
  if (exitHandled) return;
  exitHandled = true;

  console.log(`Bot is shutting down due to ${type}`);
  await client.destroy();

  process.exit(type.startsWith("SIG") ? 0 : 1);
}

process.on("SIGINT", () => handleExit("SIGINT"));
process.on("SIGTERM", () => handleExit("SIGTERM"));
process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err}`);
  handleExit("uncaughtException");
});
process.on("unhandledRejection", (reason, promise) => {
  console.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  handleExit("unhandledRejection");
});

checkLogin(client, process.env.DISCORD_TOKEN);
