import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useHistory, useParams, Switch, Route } from "react-router-dom";

import * as models from "api/models";
import { getClient } from "apiClient";
import { ensure } from "typeHelpers";
import InvoiceRow from "components/Invoices/InvoiceRow";
import InvoiceDetail from "components/Invoices/InvoiceDetail";
import InvoiceSelectProject from "components/Invoices/InvoiceSelectProject";
import InvoiceCreateNew from "components/Invoices/InvoiceCreateNew";
import Button from "components/Button";
import SlideOver from "components/SlideOver";

interface RouterProps {
  invoiceId: string;
  projectId: string;
}

interface Props {
  user: models.User;
  projects: models.Project[];
  isCreateNew?: boolean;
}

function Invoices({ user, projects, isCreateNew = false }: Props) {
  const [invoices, setInvoices] = useState<models.Invoice[]>([]);
  const [summary, setSummary] = useState<models.ProjectSummary[]>([]);
  const { projectId, invoiceId } = useParams<RouterProps>();
  const history = useHistory();

  const loadSummary = useCallback(async () => {
    const api = getClient();
    const response = await api.listProjectSummarys({});
    setSummary(response.results || []);
  }, []);

  const loadInvoices = useCallback(async () => {
    const api = getClient();
    const response = await api.listInvoices({
      limit: 20,
      offset: 0,
    });

    setInvoices(response.results || []);
  }, []);

  useEffect(() => {
    loadInvoices();
    loadSummary();
  }, [loadInvoices, loadSummary]);

  const invoiceList = useMemo(() => {
    return invoices.map((invoice) => {
      return {
        project: ensure(projects.find((p) => p.id === invoice.project)),
        invoice,
      };
    });
  }, [invoices, projects]);

  const closeSlideOver = useCallback(() => {
    history.push("/invoices");
  }, [history]);

  const createNewInvoice = useCallback(() => {
    history.push("/invoices/new");
  }, [history]);

  const project = useMemo(() => {
    return projectId
      ? ensure(projects.find((p) => p.id === parseInt(projectId, 10)))
      : ({} as models.Project);
  }, [projects, projectId]);

  const isOpen = isCreateNew || Boolean(projectId);

  return (
    <React.Fragment>
      <div className="flex justify-end my-4 w-full px-2 sm:px-0">
        <Button variant="success" onClick={createNewInvoice}>
          Create Invoice
        </Button>
      </div>
      <div className="px-2 sm:px-0">
        <div className="border-1 bg-gray-50 border-radius-sm my-4">
          <div className="bg-gray-100 flex flex-grow flex-wrap py-2 text-gray-700 text-sm md:text-base text-left p-4 justify-between items-center">
            <div className="font-semibold w-full md:w-auto">Invoice</div>
          </div>
          {invoiceList.map(({ invoice, project }) => (
            <InvoiceRow key={invoice.id} invoice={invoice} project={project} />
          ))}
        </div>
      </div>
      <SlideOver isOpen={isOpen} onClose={closeSlideOver}>
        <Switch>
          <Route path="/invoices/:projectId/:invoiceId">
            <InvoiceDetail
              project={project}
              invoiceId={invoiceId}
              onStatusUpdate={loadInvoices}
            />
          </Route>
          <Route path="/invoices/new">
            <InvoiceSelectProject
              projects={projects}
              projectSummaries={summary}
            />
          </Route>
          <Route path="/invoices/:projectId">
            <InvoiceCreateNew project={project} onIssue={loadInvoices} />
          </Route>
        </Switch>
      </SlideOver>
    </React.Fragment>
  );
}

export default Invoices;
