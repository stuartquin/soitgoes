import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import {Grid, Cell} from 'components/Grid';
import {asCurrency} from 'services/currency';

const TotalAmount = styled.div`
  font-size: 28px;
  color: #050505;
`;

const Heading = styled.div`
  font-size: 16px;
  font-weight: bold;
  padding: 12px 16px;
  padding-bottom: 0;
`;

const Issue = styled.div`
  font-size: 16px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  background: #f5f3f5;
  color: #464d59;
  padding: 12px 16px;
  text-align: center;
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #626264;
  padding: 24px 16px;
`;

const Styled = styled(Cell)`
  border-radius: 6px;
  box-shadow: 0 6px 4px hsla(0,0%,40%,.2);
  background: white;
  cursor: pointer;
  color: #050505;

  &:hover ${Issue} {
    text-decoration: underline;
  }
`;

const UpcomingInvoice = ({summary}) => {
  const {project, total, date} = summary;
  return (
    <Styled sm="3">
      <Heading>{project.name}</Heading>
      <Info>
        <TotalAmount>{asCurrency(total, project.currency)}</TotalAmount>
        <div>Since {moment(date).format('MMM. DD')}</div>
      </Info>
      <Issue>Issue &raquo;</Issue>
    </Styled>
  );
};

export default UpcomingInvoice;
