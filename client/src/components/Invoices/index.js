import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import { Text, Flex } from 'rebass/styled-components';

import NavMenu from 'components/nav/navmenu';
import InvoiceTable from 'components/Invoices/InvoiceTable';
import UpcomingSummary from 'components/Invoices/UpcomingSummary';
import Settings from 'components/Invoices/Settings';
import Filter from 'components/Filter';
import {Container, Grid, Cell} from 'components/Grid';
import {Button} from 'components/GUI';

import {fetchInvoices, fetchUpcoming} from 'services/invoice';
import {getTotal, getOverdue} from 'services/invoice';
import {getHourlyTotal} from 'services/timeslip';
import {selectWithProject, selectJoined} from 'services/selectors';

const Invoices = ({ projects }) => {
  const [invoices, setInvoices] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const projectOptions = [{
    value: null,
    label: 'All Projects',
  }].concat(Object.values(projects).map(p => ({
    value: p.id,
    label: p.name,
  })));

  const loadInvoices = async (projectId = null) => {
    const response = await fetchInvoices({ project: projectId });
    setInvoices(selectWithProject(response.results, projects));
  };

  const loadUpcoming = async () => {
    const response = await fetchUpcoming();
    setUpcoming(selectWithProject(response.results, projects));
  };

  useEffect(() => {
    loadUpcoming();
    loadInvoices();
  }, []);

  return (
    <React.Fragment>
      <NavMenu />

      <Container>
        <Flex alignItems="center" justifyContent="space-between" mb={12}>
          <Filter
            label="Project"
            options={projectOptions}
            onChange={({ value }) => loadInvoices(value)}
          />
          <Button ml={2}>New</Button>
        </Flex>

        <Flex
          width="100%"
          variant="shadow"
          background="grey_lightest"
          flexWrap="wrap"
          flexDirection={['column-reverse', 'row']}
        >
          <InvoiceTable
            invoices={invoices}
          />
          <UpcomingSummary upcoming={upcoming} />
        </Flex>
      </Container>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    projects: selectJoined(state.project.items, state),
  };
};

export default connect(mapStateToProps, {})(Invoices);
