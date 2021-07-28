import React from "react";
import { format } from "date-fns";
import { PlusCircleIcon } from "@heroicons/react/outline";

import * as models from "api/models";
import Button from "components/Button";

interface Props {
  notes: models.Note[];
}

function ContactNotes({ notes }: Props) {
  return (
    <div className="my-4">
      <div className="uppercase bg-gray-100 flex flex-grow flex-wrap py-2 text-gray-600 text-sm md:text-base text-left px-2 sm:px-4 justify-between items-center">
        <div className="text-sm">Notes</div>
        <div>
          <PlusCircleIcon className="w-4 cursor-pointer" />
        </div>
      </div>

      {notes.map((note) => (
        <div className="flex my-3 px-2 sm:px-4 justify-between items-center hover:bg-blue-50">
          <div className="flex flex-wrap items-center flex-grow">
            <div className="text-gray-800 text-sm md:text-lg mr-2 w-full sm:w-auto">
              {note.content}
            </div>
            <div className="text-gray-500 text-sm">
              {format(note.createdAt || new Date(), "yyyy-MM-dd")}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ContactNotes;
