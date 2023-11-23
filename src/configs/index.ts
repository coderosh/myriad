import * as uwuConfig from "./uwu";
import * as genzConfig from "./genz";
import * as mainConfig from "./main";
import * as nepaliConfig from "./nepali";
import * as pirateConfig from "./pirate";

const configs = {
  genz: genzConfig,
  main: mainConfig,
  nepali: nepaliConfig,
  uwu: uwuConfig,
  pirate: pirateConfig,
};

export type LangConfig = {
  [key in keyof typeof configs.main]: {
    [k in keyof (typeof configs.main)[key]]: string;
  };
};

export default configs;
