export const getContactName = (project, contacts) => {
  return contacts[project.contact] ?
    contacts[project.contact].name :
    '';
};
