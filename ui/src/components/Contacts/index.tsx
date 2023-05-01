import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useParams, Routes, Route, useNavigate } from "react-router-dom";

import { ensure } from "typeHelpers";
import * as models from "api/models";
import { getClient } from "apiClient";
import Button from "components/Button";
import SlideOver from "components/SlideOver";
import Input from "components/Form/Input";
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
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<models.Project[]>([]);
  const { contactId } = useParams<RouterProps>();
  const navigate = useNavigate();

  const loadContacts = useCallback(async (search) => {
    const api = getClient();

    const contactResponse = await api.listContacts({
      search,
    });
    setContacts(contactResponse.results || []);
  }, []);

  const loadProjects = useCallback(async () => {
    const api = getClient();
    const projectResponse = await api.listProjects({});
    setProjects(projectResponse.results || []);
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadContacts, loadProjects]);

  useEffect(() => {
    loadContacts(search);
  }, [loadContacts, search]);

  const contactList = useMemo(() => {
    return contacts.map((contact) => {
      return {
        projects: ensure(projects.filter((p) => p.contact === contact.id)),
        contact,
      };
    });
  }, [contacts, projects]);

  const closeSlideOver = useCallback(() => {
    navigate("/contacts");
  }, [navigate]);

  const createNewContact = useCallback(() => {
    navigate("/contacts/new");
  }, [navigate]);

  const handleSearch = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  const reloadContacts = useCallback(() => {
    loadContacts(search);
  }, [loadContacts, search]);

  const isOpen = isCreateNew || Boolean(contactId);

  return (
    <div className="w-full">
      <div className="flex justify-between my-4 w-full px-2 sm:px-0">
        <div>
          <Input
            type="search"
            placeholder="Search"
            value={search}
            onChange={handleSearch}
          />
        </div>
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
        <Routes>
          <Route
            path="/contacts/:contactId"
            element={
              <ContactDetail
                projects={projects}
                contactId={contactId}
                onSave={reloadContacts}
              />
            }
          />
        </Routes>
      </SlideOver>
    </div>
  );
}

export default Contacts;
