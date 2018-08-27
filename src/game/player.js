import { froge, aquarium } from "./guys";
import rand from "./rand";

export const player = aquarium({ roomNum: 0, x: 20, rand: rand.create(505) });
