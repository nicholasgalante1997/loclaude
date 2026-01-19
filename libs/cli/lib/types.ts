export interface OllamaModel {
  name: string;
  model: string;
  modified_at: string;
  size: number;
}

export interface OllamaTagsResponse {
  models: OllamaModel[];
}
