import React, { useCallback, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import * as models from "api/models";
import { getClient, removeToken } from "apiClient";

import Layout from "components/Layout";
import TimeSheet from "components/TimeSheet";
import Invoices from "components/Invoices";
import Contacts from "components/Contacts";
import { fetchInvoicesFor } from "services/fetchInvoicesFor";
import InvoiceSelectProject from "./Invoices/InvoiceSelectProject";
import InvoiceCreateNew from "./Invoices/InvoiceCreateNew";
import InvoiceDetail from "./Invoices/InvoiceDetail";
import { fetchProjects } from "services/fetchProjects";

interface Props {
  user: models.User;
}

function Main({ user }: Props) {
  const [projects, setProjects] = useState<models.Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const api = getClient();

      const version = await api.retrieveVersion();
      console.table(version);

      const response = await api.listProjects({});
      setProjects(response.results || []);
      setIsLoading(false);
    };

    load();
  }, []);

  const logout = useCallback(() => {
    removeToken();
    window.location.reload();
  }, []);

  const routes = createRoutesFromElements(
    <Route
      path="/"
      element={<Layout onLogout={logout} />}
      loader={fetchProjects}
    >
      <Route
        path="invoices"
        loader={fetchInvoicesFor}
        id="invoices"
        element={<Invoices projects={projects} />}
      >
        <Route
          path=":projectId/:invoiceId"
          element={<InvoiceDetail projects={projects} />}
        />
        <Route
          path="new"
          element={<InvoiceSelectProject projects={projects} />}
        />
        <Route
          path=":projectId"
          element={<InvoiceCreateNew projects={projects} />}
        />
      </Route>
      <Route
        path="time"
        element={<TimeSheet user={user} projects={projects} />}
      />
      <Route path="contacts/:contactId" element={<Contacts user={user} />} />
      <Route path="contacts" element={<Contacts user={user} />} />
      <Route path="" element={<TimeSheet user={user} projects={projects} />} />
    </Route>
  );

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}

export default Main;
