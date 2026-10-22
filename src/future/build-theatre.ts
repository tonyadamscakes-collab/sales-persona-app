/**
 * Later phase: after a won sitting, play a build theatre that adds the
 * owner's chosen tools to the app being built. Not wired into the screens yet.
 */
export type BuildTool = {
  id: string;
  name: string;
};

export type BuildTheatrePlan = {
  sessionId: string;
  tools: BuildTool[];
};

export function planBuildTheatre(sessionId: string, tools: readonly BuildTool[] = []): BuildTheatrePlan {
  return { sessionId, tools: [...tools] };
}
