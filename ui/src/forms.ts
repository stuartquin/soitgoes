import React from 'react';

type FormValues = {
    [key:string]: string | null
};

export const getFormValues = (event: React.FormEvent<HTMLFormElement>): FormValues => {
  event.preventDefault();
  const target = event.target as HTMLFormElement;
  return Array.from(target.elements).reduce<FormValues>((acc, element: Element) => {
    const id: string = element.getAttribute("id") || "";

    if (id) {
      acc[id] = (element as HTMLInputElement).value;
    }

    return acc;
  }, {});
};
