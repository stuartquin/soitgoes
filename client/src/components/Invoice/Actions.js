import React from 'react';
import styled from 'styled-components';
import { Link, Box, Flex } from 'rebass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import { Button } from 'components/GUI';

const DownloadLink = styled.a`
  color: #464d59;
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

const Actions = ({ invoice, onUpdateStatus, onDelete }) => {
  const isIssued = Boolean(invoice.issued_at);
  const downloadURL = `/api/invoices/${invoice.id}/pdf`;
  console.log(isIssued, invoice.issued_at);

  return (
    <Flex alignItems="center">
      {isIssued && (
        <React.Fragment>
          <Link color="danger_dark">Delete</Link>
          <Link
            download
            ml={12}
            href={downloadURL}
            title="Download PDF"
            color="brand_dark"
            variant="link"
          >
            <FontAwesomeIcon icon={faDownload} />
          </Link>
        </React.Fragment>
      )}
      <Box ml={12}>{getStatusAction(invoice, onUpdateStatus)}</Box>
    </Flex>
  );
};

export default Actions;
