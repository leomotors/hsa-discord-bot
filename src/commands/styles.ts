import { EmbedStyle } from "cocoa-discord";

import { environment } from "../environment.js";

export const style = new EmbedStyle({
  author: "invoker",
  color: environment.COLOR_THEME,
  footer: { text: "Bot made by Leomotors with ❤️❤️❤️" },
});
