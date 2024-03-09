import tag from "./tag";

interface Note {
  title: string;
  content: string;
  tags?: tag[];
  owner: string;
  archived: boolean;
  created: Date;
}

export default Note;
