const stages = { code: 0, scene: 0, assets: 0, city: 0, frame: 0 };
const weights = { code: 10, scene: 25, assets: 15, city: 30, frame: 20 };

export function progress(stage, fraction = 1) {
  stages[stage] = Math.max(stages[stage], fraction);
  const value = Object.keys(stages).reduce((sum, key) => sum + stages[key] * weights[key], 0);
  const rounded = Math.round(value);
  const detail = Math.min(100, rounded);
  const event = new CustomEvent('scene-progress', { detail });
  window.dispatchEvent(event);
}

export async function yieldToBrowser() {
  if (globalThis.scheduler?.yield) await scheduler.yield();
  else await new Promise(resolve => setTimeout(resolve, 0));
}
