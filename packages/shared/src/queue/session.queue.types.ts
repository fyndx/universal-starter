export type PruneExpiredJobData = {
  batchSize: number;
};

export type PruneExpiredJobResult = {
  deleted: number;
  batches: number;
};
