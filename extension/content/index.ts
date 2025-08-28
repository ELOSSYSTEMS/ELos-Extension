import { attachIdleListener } from "./listener";
import { mountFloatingPlus } from "./plusmenu";

function boot() {
  mountFloatingPlus();
  attachIdleListener();
}
setTimeout(boot, 1200);
