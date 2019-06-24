import React from 'react';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload} from '@fortawesome/free-solid-svg-icons'

import {Button, ActionLink} from 'components/GUI';

const Styled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  border-top-left-radius: 6px;
  color: #464d59;
  text-align: center;
`;

const DownloadLink = styled.a`
  color: #464d59;
  margin-right: 8px;
  margin-left: 8px;
`;

const getStatusAction = (invoice, onUpdateStatus) => {
  if (!invoice.status) {
    return (
      <Button type="success" onClick={() => onUpdateStatus('ISSUED')}>
        Issue
      </Button>
    );
  }
  if (invoice.status === 'ISSUED') {
    return (
      <Button type="success" onClick={() => onUpdateStatus('PAID')}>
        Set Paid
      </Button>
    );
  }

  return null;
};

const Actions = ({invoice, onUpdateStatus, onDelete}) => {
  const downloadURL = `/api/invoices/${invoice.id}/pdf`;
  const isIssued = Boolean(invoice.status);

  return (
    <Styled>
      {isIssued ? (
        <ActionLink size="sm" type="danger">Delete</ActionLink>
      ): <div />}
      <div>
        {isIssued && (
          <DownloadLink download href={downloadURL} title="Download PDF">
            <FontAwesomeIcon icon={faDownload} />
          </DownloadLink>
        )}
        {getStatusAction(invoice, onUpdateStatus)}
      </div>
    </Styled>
  );
};

export default Actions;
