import { CocoaVersion } from "cocoa-discord/meta";
import {
  Param,
  SlashCommand,
  SlashModuleClass,
} from "cocoa-discord/slash/class";
import { getStatusFields } from "cocoa-discord/template";
import { MessageFlags } from "discord.js";

import { environment } from "../environment.js";
import { exec } from "../libs/exec.js";
import { style } from "./styles.js";

export class MainSlashModule extends SlashModuleClass {
  constructor() {
    super("Main Cog", "Main Slash Cog of this bot");
  }

  @SlashCommand("Starting the container")
  async container_start(
    ctx: SlashCommand.Context,
    @Param.String("Choose a container to start")
    @Param.Choices<Param.String.Type>(environment.STARTABLE_CONTAINERS)
    container: Param.String.Type,
  ) {
    if (!environment.ALLOWED_USERS.includes(ctx.user.id)) {
      await ctx.reply({
        content: "You do not have permission to perform this action.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await ctx.deferReply();
    try {
      const { stdout, stderr } = await exec(`docker start ${container}`);
      if (stdout) {
        console.log(
          `Container ${container} started successfully, stdout:\n${stdout}`,
        );
      }
      if (stderr) {
        console.error(
          `Container ${container} started with errors, stderr:\n${stderr}`,
        );
      }
      await ctx.followUp(
        `Container ${container} started successfully.${stderr ? ` with stderr` : ""}`,
      );
    } catch (error) {
      console.error("Error starting container:", error);
      await ctx.followUp(
        `Failed to start container ${container}. Error: ${error}`.slice(
          0,
          2000,
        ),
      );
      return;
    }
  }

  @SlashCommand("Asking the bot if they are fine")
  async status(
    ctx: SlashCommand.Context,
    @Param.Ephemeral ephemeral: Param.Ephemeral.Type,
  ) {
    const emb = style
      .use(ctx)
      .setTitle(`${environment.PA_NAME}PA's Status`)
      .setDescription(
        `Waifu Bot Version: ${APP_VERSION}\nCocoa Utils Version: ${CocoaVersion}`,
      )
      .addFields(await getStatusFields(ctx));

    await ctx.reply({
      embeds: [emb],
      flags: ephemeral ? MessageFlags.Ephemeral : undefined,
    });
  }
}
