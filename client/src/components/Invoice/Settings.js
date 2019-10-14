import React from 'react';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload} from '@fortawesome/free-solid-svg-icons'

import Summary from 'components/Invoice/Summary';
import {Divider} from 'components/GUI';
import {Input} from 'components/Form';
import {BREAKPOINTS} from 'components/Grid';

const InvoiceInputRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;

  padding: 12px 16px;
`;

const Styled = styled.div`
  background: white;
  color: #4e5767;
  height: 100%;
  width: 290px;
  border-radius: 6px;
  box-shadow: 0 6px 4px hsla(0,0%,40%,.2);

  @media(max-width: ${BREAKPOINTS.sm}) {
    height: auto;
    width: 100%;
    margin-bottom: 0;
    box-shadow: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

const Heading = styled.h3`
  margin-top: 12px;
  margin-bottom: 12px;
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
  justify-content: space-between;
`;

const DownloadLink = styled.a`
  color: #464d59;
  margin-right: 8px;
  margin-left: 8px;
`;

const Settings = (props) => {
  const {
    invoice, project, modifiers, onChange, onRemoveModifier, reference, dueDate
  } = props;
  const isEditable = !Boolean(invoice.issued_at);
  const downloadURL = `/api/invoices/${invoice.id}/pdf`;

  return (
    <Styled>
      <Heading>
        {project.name} #{invoice.sequence_num}

        {!isEditable && (
          <DownloadLink download href={downloadURL} title="Download PDF">
            <FontAwesomeIcon icon={faDownload} />
          </DownloadLink>
        )}
      </Heading>

      <InvoiceInputRow>
        <div>Due Date</div>
        <Input
          type="date"
          name="due_date"
          value={dueDate || ''}
          onChange={onChange}
          disabled={!isEditable}
        />
      </InvoiceInputRow>

      <InvoiceInputRow>
        <div>Reference</div>
        <Input
          type="text"
          name="reference"
          value={reference || ''}
          onChange={onChange}
          disabled={!isEditable}
        />
      </InvoiceInputRow>

      <Divider />

      <Summary
        modifiers={modifiers}
        invoice={invoice}
        project={project}
        onRemoveModifier={onRemoveModifier}
      />
    </Styled>
  );
};

export default Settings;
