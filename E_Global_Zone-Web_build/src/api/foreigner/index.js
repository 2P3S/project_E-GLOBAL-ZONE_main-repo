import foreigner from "../axios";
import reservation from "./reservation";
import schedule from "./schedule";

const patchPassword = (std_for_passwd) => foreigner.patch("/password", { std_for_passwd });

export default { ...reservation, ...schedule, patchPassword };
