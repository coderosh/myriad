import * as uwuConfig from "./uwu";
import * as genzConfig from "./genz";
import * as mainConfig from "./main";
import * as nepaliConfig from "./nepali";

const configs = {
  genz: genzConfig,
  main: mainConfig,
  nepali: nepaliConfig,
  uwu: uwuConfig,
};

export type LangConfig = {
  [key in keyof typeof configs.main]: {
    [k in keyof (typeof configs.main)[key]]: string;
  };
};

export default configs;
