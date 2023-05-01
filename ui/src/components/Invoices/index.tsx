import React, { useCallback, useState, useEffect, useMemo } from "react";
import {
  useParams,
  useNavigate,
  Outlet,
  useLocation,
  useRouteLoaderData,
  useAsyncValue,
} from "react-router-dom";

import * as models from "api/models";
import { getClient } from "apiClient";
import { ensure } from "typeHelpers";
import InvoiceRow from "components/Invoices/InvoiceRow";
import Button from "components/Button";
import SlideOver from "components/SlideOver";

interface Props {
  projects: models.Project[];
}

function Invoices({ projects }: Props) {
  const params = useParams();
  const location = useLocation();
  const { projectId } = params;
  const navigate = useNavigate();

  const data = useAsyncValue();
  console.log("INVOICES....", data);

  const invoices = useRouteLoaderData("invoices") as models.Invoice[];
  console.log("invoices", invoices);

  const invoiceList = useMemo(() => {
    return projects.length
      ? invoices.map((invoice) => {
          return {
            project: ensure(projects.find((p) => p.id === invoice.project)),
            invoice,
          };
        })
      : [];
  }, [invoices, projects]);

  const closeSlideOver = useCallback(() => {
    navigate("/invoices");
  }, [navigate]);

  const createNewInvoice = useCallback(() => {
    navigate("/invoices/new");
  }, [navigate]);

  const isOpen = location.pathname.includes("/new") || Boolean(projectId);

  return (
    <div className="w-full">
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
        <Outlet />
      </SlideOver>
    </div>
  );
}

export default Invoices;
