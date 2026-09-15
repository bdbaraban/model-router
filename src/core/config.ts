import { readFile } from "node:fs/promises";
import { parse as parseYaml } from "yaml";
import { z } from "zod";
import { tiers, type RoutingConfig } from "./types.js";

const modelSchema = z.object({
  id: z.string().min(1), name: z.string().optional(), tier: z.enum(tiers),
  scores: z.object({ cost: z.number().min(1).max(10), coding: z.number().min(1).max(10), orchestration: z.number().min(1).max(10), taste: z.number().min(1).max(10) }),
  cost: z.number().nonnegative(), notes: z.string().optional(), enabled: z.boolean().optional()
});
const configSchema = z.object({ models: z.array(modelSchema), thresholds: z.object({ low: z.number().min(1).max(10), medium: z.number().min(1).max(10), high: z.number().min(1).max(10), escalated: z.number().min(1).max(10) }) });
export type ConfigInput = z.input<typeof configSchema>;

export function validateConfig(input: unknown): RoutingConfig { return configSchema.parse(input); }

/** Merges models by id; user entries replace matching defaults and append new models. */
export function mergeConfigs(defaultConfig: RoutingConfig, userConfig?: Partial<RoutingConfig>): RoutingConfig {
  if (!userConfig) return defaultConfig;
  const byId = new Map(defaultConfig.models.map((model) => [model.id, model]));
  for (const model of userConfig.models ?? []) byId.set(model.id, model);
  return validateConfig({ models: [...byId.values()], thresholds: { ...defaultConfig.thresholds, ...userConfig.thresholds } });
}

export async function loadConfig(defaultPath: string, userPath = process.env.MODEL_ROUTER_CONFIG): Promise<RoutingConfig> {
  const defaultConfig = validateConfig(parseConfig(await readFile(defaultPath, "utf8"), defaultPath));
  if (!userPath) return defaultConfig;
  const userConfig = parseConfig(await readFile(userPath, "utf8"), userPath) as Partial<RoutingConfig>;
  return mergeConfigs(defaultConfig, userConfig);
}

function parseConfig(source: string, filename: string): unknown {
  return filename.endsWith(".json") ? JSON.parse(source) : parseYaml(source);
}
