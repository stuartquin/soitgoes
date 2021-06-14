import React from "react";
import { Link, Switch, Route } from "react-router-dom";

import * as models from "api/models";
import { formatCurrency } from "currency";
import { ensure } from "typeHelpers";

interface Props {
  project: models.Project;
}

function InvoiceForm({ project }: Props) {
  return (
    <div>
      <form action="#" method="POST">
        <div className="shadow sm:rounded-md sm:overflow-hidden">
          <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 sm:col-span-2">
                <label
                  htmlFor="company_website"
                  className="block text-sm font-medium text-gray-700"
                >
                  Website
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="company_website"
                    id="company_website"
                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 p-2"
                    placeholder="www.example.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="about"
                className="block text-sm font-medium text-gray-700"
              >
                About
              </label>
              <div className="mt-1">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                  placeholder="you@example.com"
                ></textarea>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Brief description for your profile. URLs are hyperlinked.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default InvoiceForm;
