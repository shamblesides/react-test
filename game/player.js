import { froge } from "./guys";
import rand from "./rand";

export const player = froge({ roomNum: 0, x: 20, rand: rand.create(505) });
