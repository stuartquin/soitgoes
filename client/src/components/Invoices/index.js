import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Text, Flex } from 'rebass/styled-components';

import InvoiceTable from 'components/Invoices/InvoiceTable';
import UpcomingSummary from 'components/Invoices/UpcomingSummary';
import Settings from 'components/Invoices/Settings';
import Filter from 'components/Filter';
import { Button } from 'components/GUI';

import {
  fetchInvoices,
  fetchUpcoming,
  getInvoiceStatus,
} from 'services/invoice';
import { getTotal, getOverdue } from 'services/invoice';
import { getHourlyTotal } from 'services/timeslip';
import { selectWithProject, selectJoined } from 'services/selectors';
import { getQueryParams, updateQueryParams } from 'services/url';

const stateOptions = [
  { value: null, label: 'All Invoices' },
  { value: 'ISSUED', label: 'Issued' },
  { value: 'PAID', label: 'Paid' },
  { value: 'OVERDUE', label: 'Overdue' },
];

const getCurrentPage = location => {
  const params = getQueryParams(location.search);
  return parseInt(params['page'] || 0, 10);
};

const Invoices = ({ projects, history, location }) => {
  const [invoices, setInvoices] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [totalInvoices, setTotalInvoices] = useState();
  const [stateFilter, setStateFilter] = useState();
  const projectOptions = [
    {
      value: null,
      label: 'All Projects',
    },
  ].concat(
    Object.values(projects).map(p => ({
      value: p.id,
      label: p.name,
    }))
  );

  const loadInvoices = async (projectId = null, page = null) => {
    const offset = page * 20;
    const response = await fetchInvoices({ project: projectId, offset });
    const withState = response.results.map(inv => ({
      ...inv,
      state: getInvoiceStatus(inv),
    }));

    setTotalInvoices(response.count || 0);
    setInvoices(selectWithProject(withState, projects));
  };

  const loadUpcoming = async () => {
    const response = await fetchUpcoming();
    setUpcoming(selectWithProject(response.results, projects));
  };

  const params = getQueryParams(location.search);
  const currentPage = parseInt(params['page'] || 0, 10);
  const selectedProjectId = parseInt(params['project'] || 0, 10) || null;

  useEffect(() => {
    loadUpcoming();
  }, []);

  useEffect(() => {
    loadInvoices(selectedProjectId, currentPage);
  }, [selectedProjectId, currentPage]);

  const handleFilterProject = projectId => {
    history.push(updateQueryParams({ project: projectId, page: 0 }));
  };

  const filteredInvoices = stateFilter
    ? invoices.filter(inv => inv.state === stateFilter)
    : invoices;

  return (
    <React.Fragment>
      <Flex alignItems="center" justifyContent="flex-start" flexWrap="wrap">
        <Filter
          label="Project"
          options={projectOptions}
          onChange={({ value }) => handleFilterProject(value)}
          mr={[0, 2]}
          mb={12}
          flexGrow="1"
          maxWidth={['100%', '300px']}
        />
        <Filter
          label="Status"
          options={stateOptions}
          onChange={({ value }) => setStateFilter(value)}
          mb={12}
          flexGrow="1"
          maxWidth={['100%', '300px']}
        />
      </Flex>

      <Flex
        width="100%"
        variant="shadow"
        background="grey_lightest"
        flexDirection={['column-reverse', 'row']}
      >
        <InvoiceTable
          invoices={filteredInvoices}
          page={currentPage}
          total={totalInvoices || 0}
        />
        <UpcomingSummary upcoming={upcoming} />
      </Flex>
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    projects: selectJoined(state.project.items, state),
  };
};

export default connect(
  mapStateToProps,
  {}
)(Invoices);
