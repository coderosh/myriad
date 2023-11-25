import * as uwuConfig from "./uwu";
import * as genzConfig from "./genz";
import * as myriadConfig from "./myriad";
import * as nepaliConfig from "./nepali";
import * as pirateConfig from "./pirate";

const configs = {
  genz: genzConfig,
  myriad: myriadConfig,
  nepali: nepaliConfig,
  uwu: uwuConfig,
  pirate: pirateConfig,
};

export type LangConfig = {
  [key in keyof typeof configs.myriad]: {
    [k in keyof (typeof configs.myriad)[key]]: string;
  };
};

export default configs;
