import data from "./vaultwarden.json";
import { projectSchema } from "../../lib/catalog-validation";

export default projectSchema.parse(data);
