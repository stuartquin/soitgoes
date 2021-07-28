import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import * as models from "api/models";
import { getClient } from "apiClient";
import Button from "components/Button";
import ContactForm from "components/Contacts/ContactForm";
import ContactNotes from "components/Contacts/ContactNotes";

interface Props {
  contactId: string;
  projects: models.Project[];
  onSave: () => void;
}

function ContactDetail({ contactId, projects, onSave }: Props) {
  const [contact, setContact] = useState<models.Contact>();
  const [notes, setNotes] = useState<models.Note[]>([]);
  const [hasChanged, setHasChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const api = getClient();

      if (contactId) {
        if (contactId === "new") {
          setContact(models.ContactFromJSON({}));
        } else {
          setContact(await api.retrieveContact({ id: contactId }));
          const noteResponse = await api.listNotes({ contact: `${contactId}` });
          setNotes(noteResponse.results || []);
        }
      }
    };

    load();
  }, [contactId, projects]);

  const updateContact = useCallback((updatedContact: models.Contact) => {
    setHasChanged(true);
    setContact(updatedContact);
  }, []);

  const saveContact = useCallback(async () => {
    if (contact) {
      const api = getClient();
      const method = contact.id
        ? api.updateContact({ id: `${contact.id}`, contact: { ...contact } })
        : api.createContact({ contact: { ...contact } });
      setContact(await method);
      setHasChanged(false);
      onSave();
    }
  }, [contact, onSave]);

  return contact ? (
    <div>
      <div className="flex justify-between mb-6">
        <div className="text-gray-800 text-md sm:text-lg">{contact.name}</div>
        <Button variant="success" onClick={saveContact} disabled={!hasChanged}>
          Save
        </Button>
      </div>
      <div className="bg-gray-100 p-4">
        <ContactForm contact={contact} onUpdate={updateContact} />
      </div>

      <ContactNotes notes={notes} />
    </div>
  ) : (
    <div>Loading</div>
  );
}

export default ContactDetail;
