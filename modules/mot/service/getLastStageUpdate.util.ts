import { IServiceStageExecution, IStageDocument } from "@/modules/mot/service/service.types";

export const getLastStageUpdate = (stages?: IServiceStageExecution[]): string | null => {
  if (!stages || stages.length === 0) return null;

  let times: number[] = [];

  stages.forEach((stage) => {
    stage.documents?.forEach((doc: IStageDocument) => {
      if (doc.uploadedDate) times.push(new Date(doc.uploadedDate).getTime());
    });

    stage.stageComments?.forEach((comment) => {
      if (comment.createdDate) times.push(new Date(comment.createdDate).getTime());
    });
  });

  if (times.length === 0) return null;

  const last = Math.max(...times);
  return new Date(last).toISOString();
};
