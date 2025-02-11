export interface Root {
  folders: Folder[];
}

export interface Folder {
  id: string;
  title: string;
  description: string;
  images: Image[];
}

export interface Image {
  url: string;
}
