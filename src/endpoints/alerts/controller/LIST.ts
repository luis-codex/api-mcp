import { D1ListEndpoint } from "chanfana";
import { HandleArgs } from "../../../types";
import { AlertModel } from "../../../schemas/schemaAlerts";

export class AlertList extends D1ListEndpoint<HandleArgs> {
  _meta = { model: AlertModel };
  searchFields = ["type", "severity", "status", "message", "assignedTo"];
  defaultOrderBy = "triggeredAt DESC";
}
