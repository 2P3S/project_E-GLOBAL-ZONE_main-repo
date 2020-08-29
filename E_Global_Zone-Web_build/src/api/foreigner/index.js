import { foreigner } from "../axios";

export const patchPassword = (std_for_passwd) => foreigner.patch("/password", { std_for_passwd });
