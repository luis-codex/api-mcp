import { D1ReadEndpoint } from "chanfana";
import { HandleArgs } from "../../../types";
import { AlertModel } from "../../../schemas/schemaAlerts";

export class AlertRead extends D1ReadEndpoint<HandleArgs> {
  _meta = { model: AlertModel };
}
