import { IServiceStageExecution, StageStatus } from "./service.types";

const IGNORED_COMPLETION_STAGES = [2, 3, 8];

export function getServiceStatus(
  stages: IServiceStageExecution[]
): StageStatus {
  if (!stages || stages.length === 0) {
    return StageStatus.NotStarted;
  }

  const relevantStages = stages.filter(
    s => !IGNORED_COMPLETION_STAGES.includes(s.stage)
  );

  const allCompleted = relevantStages.every(
    s => s.status === StageStatus.Completed
  );

  if (allCompleted) {
    return StageStatus.Completed;
  }

  const allNotStarted = stages.every(
    s => s.status === StageStatus.NotStarted
  );

  if (allNotStarted) {
    return StageStatus.NotStarted;
  }

  const hasPendingOrStarted = stages.some(
    s =>
      s.status === StageStatus.Pending ||
      s.status === StageStatus.InProgress
  );

  if (hasPendingOrStarted) {
    return StageStatus.Pending;
  }

  return StageStatus.InProgress;
}
