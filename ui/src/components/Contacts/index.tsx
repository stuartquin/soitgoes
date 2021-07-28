import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useHistory, useParams, Switch, Route } from "react-router-dom";

import { ensure } from "typeHelpers";
import * as models from "api/models";
import { getClient } from "apiClient";
import Button from "components/Button";
import SlideOver from "components/SlideOver";
import ContactRow from "components/Contacts/ContactRow";
import ContactDetail from "components/Contacts/ContactDetail";

interface RouterProps {
  contactId: string;
}

interface Props {
  user: models.User;
  isCreateNew?: boolean;
}

function Contacts({ user, isCreateNew }: Props) {
  const [contacts, setContacts] = useState<models.Contact[]>([]);
  const [projects, setProjects] = useState<models.Project[]>([]);
  const { contactId } = useParams<RouterProps>();
  const history = useHistory();

  const loadContacts = useCallback(async () => {
    const api = getClient();

    const contactResponse = await api.listContacts({});
    setContacts(contactResponse.results || []);

    const projectResponse = await api.listProjects({});
    setProjects(projectResponse.results || []);
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const contactList = useMemo(() => {
    return contacts.map((contact) => {
      return {
        projects: ensure(projects.filter((p) => p.contact === contact.id)),
        contact,
      };
    });
  }, [contacts, projects]);

  const closeSlideOver = useCallback(() => {
    history.push("/contacts");
  }, [history]);

  const createNewContact = useCallback(() => {
    history.push("/contacts/new");
  }, [history]);

  const isOpen = isCreateNew || Boolean(contactId);

  return (
    <div className="w-full">
      <div className="flex justify-end my-4 w-full px-2 sm:px-0">
        <Button variant="success" onClick={createNewContact}>
          Create Contact
        </Button>
      </div>
      <div className="px-2 sm:px-0">
        <div className="border-1 bg-gray-50 border-radius-sm my-4">
          <div className="bg-gray-100 flex flex-grow flex-wrap py-2 text-gray-700 text-sm md:text-base text-left p-4 justify-between items-center">
            <div className="font-semibold w-full md:w-auto">Contact</div>
          </div>
          {contactList.map(({ contact, projects }) => (
            <ContactRow
              contact={contact}
              key={contact.id}
              projects={projects}
            />
          ))}
        </div>
      </div>
      <SlideOver isOpen={isOpen} onClose={closeSlideOver}>
        <Switch>
          <Route path="/contacts/:contactId">
            <ContactDetail
              projects={projects}
              contactId={contactId}
              onSave={loadContacts}
            />
          </Route>
        </Switch>
      </SlideOver>
    </div>
  );
}

export default Contacts;
