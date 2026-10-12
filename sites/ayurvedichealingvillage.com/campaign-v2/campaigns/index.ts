import type { CampaignConfig } from "../kit/types.ts";
import template from "./_template.ts";
import panchakarma from "./panchakarma.ts";

export const CAMPAIGNS: Record<string, CampaignConfig> = { _template: template, panchakarma };
