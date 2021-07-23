import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import * as models from "api/models";
import { getClient } from "apiClient";

interface Props {
  contactId: string;
  projects: models.Project[];
  onSave: () => void;
}

function ContactDetail({ contactId, projects, onSave }: Props) {
  const [contact, setContact] = useState<models.Contact>();
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const api = getClient();

      if (contactId) {
        setContact(await api.retrieveContact({ id: contactId }));
      }
    };

    load();
  }, [contactId, projects]);

  const updateContact = useCallback((updatedContact: models.Contact) => {
    setContact(updatedContact);
  }, []);

  return (
    <div>
      {contact && (
        <React.Fragment>
          <div>{contact.name}</div>
        </React.Fragment>
      )}
    </div>
  );
}

export default ContactDetail;
