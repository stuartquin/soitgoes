import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Text, Flex } from "rebass/styled-components";

import InvoiceTable from "components/Invoices/InvoiceTable";
import UpcomingSummary from "components/Invoices/UpcomingSummary";
import Settings from "components/Invoices/Settings";
import Filter from "components/Filter";
import { Button } from "components/GUI";

import {
  fetchInvoices,
  fetchUpcoming,
  getInvoiceStatus
} from "services/invoice";
import { getTotal, getOverdue } from "services/invoice";
import { getHourlyTotal } from "services/timeslip";
import { selectWithProject, selectJoined } from "services/selectors";

const stateOptions = [
  { value: null, label: "All Invoices" },
  { value: "ISSUED", label: "Issued" },
  { value: "PAID", label: "Paid" },
  { value: "OVERDUE", label: "Overdue" }
];

const Invoices = ({ projects }) => {
  const [invoices, setInvoices] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [stateFilter, setStateFilter] = useState();
  const projectOptions = [
    {
      value: null,
      label: "All Projects"
    }
  ].concat(
    Object.values(projects).map(p => ({
      value: p.id,
      label: p.name
    }))
  );

  const loadInvoices = async (projectId = null) => {
    const response = await fetchInvoices({ project: projectId });
    const withState = response.results.map(inv => ({
      ...inv,
      state: getInvoiceStatus(inv)
    }));

    setInvoices(selectWithProject(withState, projects));
  };

  const loadUpcoming = async () => {
    const response = await fetchUpcoming();
    setUpcoming(selectWithProject(response.results, projects));
  };

  useEffect(() => {
    loadUpcoming();
    loadInvoices();
  }, []);

  const filteredInvoices = stateFilter
    ? invoices.filter(inv => inv.state === stateFilter)
    : invoices;

  return (
    <React.Fragment>
      <Flex alignItems="center" justifyContent="flex-start" flexWrap="wrap">
        <Filter
          label="Project"
          options={projectOptions}
          onChange={({ value }) => loadInvoices(value)}
          mr={[0, 2]}
          mb={12}
          flexGrow="1"
          maxWidth={["100%", "300px"]}
        />
        <Filter
          label="Status"
          options={stateOptions}
          onChange={({ value }) => setStateFilter(value)}
          mb={12}
          flexGrow="1"
          maxWidth={["100%", "300px"]}
        />
      </Flex>

      <Flex
        width="100%"
        variant="shadow"
        background="grey_lightest"
        flexDirection={["column-reverse", "row"]}
      >
        <InvoiceTable invoices={filteredInvoices} />
        <UpcomingSummary upcoming={upcoming} />
      </Flex>
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    projects: selectJoined(state.project.items, state)
  };
};

export default connect(
  mapStateToProps,
  {}
)(Invoices);
