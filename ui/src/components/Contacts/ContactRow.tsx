import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

import * as models from "api/models";

interface Props {
  contact: models.Contact;
  projects: models.Project[];
}

function ContactRow({ contact, projects }: Props) {
  const borderClass = "";
  const project = projects.length ? projects[0] : null;

  return (
    <Link
      to={`/contacts/${contact.id}`}
      className={`cursor-pointer border-l-4 flex hover:bg-blue-50 justify-between my-2 py-3 px-4 ${borderClass}`}
    >
      <div className="flex-grow">
        <div className="text-gray-800 text-sm md:text-lg">{contact.name}</div>
        <div className="text-gray-500 text-sm">
          {format(contact.createdAt || new Date(), "yyyy-MM-dd")}
        </div>
      </div>
      <div className="text-right">
        {project && (
          <div className="text-sm md:text-lg text-gray-800">{project.name}</div>
        )}
      </div>
    </Link>
  );
}

export default ContactRow;
