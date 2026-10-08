import data from "./syncthing.json";
import { projectSchema } from "../../lib/catalog-validation";

export default projectSchema.parse(data);
