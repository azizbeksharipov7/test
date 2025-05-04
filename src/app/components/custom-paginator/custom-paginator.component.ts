import { MatPaginatorIntl } from '@angular/material/paginator';

export function CustomPaginator(): MatPaginatorIntl {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `Sahifa 0 / 0`;
    }

    const totalPages = Math.ceil(length / pageSize);
    return `Sahifa ${page + 1} / ${totalPages}`;
  };

  return customPaginatorIntl;
}
