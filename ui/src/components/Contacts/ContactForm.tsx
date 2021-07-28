import React, { useCallback } from "react";

import * as models from "api/models";
import Label from "components/Form/Label";
import Input from "components/Form/Input";

interface Props {
  contact: models.Contact;
  onUpdate: (contact: models.Contact) => void;
}

function ContactForm({ contact, onUpdate }: Props) {
  const updateContact = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const target = event.target as HTMLInputElement;
      const { name } = target;
      const value = target.type === "checkbox" ? target.checked : target.value;
      onUpdate({ ...contact, [name]: value });
    },
    [contact, onUpdate]
  );
  return (
    <form action="#" method="POST" className="w-full sm:w-auto">
      <div className="my-4">
        <Label htmlFor="name">Name</Label>
        <Input
          name="name"
          id="name"
          value={contact.name}
          onChange={updateContact}
          className="w-full"
        />
      </div>
      <div className="my-4">
        <Label htmlFor="email">Email</Label>
        <Input
          name="email"
          id="email"
          value={contact.email}
          onChange={updateContact}
          className="w-full"
        />
      </div>
      <details className="w-full sm:text-sm border border-gray-300 rounded p-2">
        <summary className="cursor-pointer">Address</summary>
        <div>
          <div className="my-4">
            <Label htmlFor="address1">Address 1</Label>
            <Input
              name="address1"
              id="address1"
              value={contact.address1 || ""}
              onChange={updateContact}
              className="w-full"
            />
          </div>
          <div className="my-4">
            <Label htmlFor="address2">Address 2</Label>
            <Input
              name="address2"
              id="address2"
              value={contact.address2 || ""}
              onChange={updateContact}
              className="w-full"
            />
          </div>

          <div className="my-4">
            <Label htmlFor="city">City</Label>
            <Input
              name="city"
              id="city"
              value={contact.city || ""}
              onChange={updateContact}
              className="w-full"
            />
          </div>
          <div className="my-4">
            <Label htmlFor="postCode">Post Code</Label>
            <Input
              name="postCode"
              id="postCode"
              value={contact.postCode || ""}
              onChange={updateContact}
              className="w-full"
            />
          </div>
        </div>
      </details>
    </form>
  );
}

export default ContactForm;
