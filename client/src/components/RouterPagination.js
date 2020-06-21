import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { Text, Flex } from 'rebass';

import { updateQueryParams } from 'services/url';

export const PaginationLink = styled(Link)`
  padding: 12px 16px;
  cursor: pointer;
  text-decoration: none;
  color: ${(props) => props.theme.colors.text};

  ${(props) =>
    props.selected &&
    css`
      font-weight: bold;
      color: ${(props) => props.theme.colors.brand_darkest};
    `}
`;

const RouterPagination = ({ page, total, path, perPage = 20 }) => {
  const totalPages = Math.ceil(total / perPage);
  const pages = [...Array(totalPages).keys()];

  return (
    <Flex justifyContent="flex-end">
      {pages.map((p) => (
        <PaginationLink
          key={p}
          to={updateQueryParams({ page: p })}
          selected={page === p}
        >
          {p + 1}
        </PaginationLink>
      ))}
    </Flex>
  );
};

export default RouterPagination;
