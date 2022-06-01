export interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
  readonly webkitRelativePath: string;
}

export type AvatarParser = (doc: Document) => {
  icon?: string;
  url?: string;
  color?: string;
  text?: string;
};

export type Document = Record<string, unknown>;
