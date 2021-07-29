import React, { useCallback, useState } from "react";
import { format } from "date-fns";
import { PlusCircleIcon } from "@heroicons/react/outline";

import * as models from "api/models";
import Button from "components/Button";
import Textarea from "components/Form/Textarea";

interface Props {
  notes: models.Note[];
  onAdd: (content: string) => void;
}

function ContactNotes({ notes, onAdd }: Props) {
  const [content, setContent] = useState("");
  const updateNote = useCallback((event) => {
    setContent(event.target.value);
  }, []);

  const addNote = () => {
    onAdd(content);
    setContent("");
  };

  return (
    <div className="my-4">
      <div className="uppercase bg-gray-100 flex flex-grow flex-wrap py-2 text-gray-600 text-sm md:text-base text-left px-2 sm:px-4 justify-between items-center">
        <div className="text-sm">Notes</div>
        <div>
          <PlusCircleIcon className="w-4 cursor-pointer" />
        </div>
      </div>
      <div className="my-3 relative">
        <Textarea
          rows={3}
          placeholder="Add Note"
          className="w-full pr-5"
          value={content}
          onChange={updateNote}
        ></Textarea>
        <Button
          variant="success"
          size="small"
          className="absolute right-3 bottom-3"
          onClick={addNote}
        >
          Add
        </Button>
      </div>

      {notes.map((note) => (
        <div className="my-3 px-2 sm:px-4 justify-between items-center hover:bg-blue-50">
          <div className="flex flex-wrap items-center flex-grow">
            <div className="text-gray-800 text-sm md:text-lg mr-2 w-full sm:w-auto">
              {note.content}
            </div>
          </div>
          <div className="text-gray-500 text-sm">
            {format(note.createdAt || new Date(), "yyyy-MM-dd")}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ContactNotes;
