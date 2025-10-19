export type ApiParams<TParams extends Record<string, string> = {}> = {
  params: Promise<TParams>;
};