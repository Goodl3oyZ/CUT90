import React from 'react';
import clsx from 'clsx';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  className?: string;
}

export function Table({ className, children, ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm">
      <table className={clsx('w-full text-left text-xs border-collapse', className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className, children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={clsx(
        'bg-[var(--bg-surface-elevated)] sticky top-0 z-20 text-[var(--text-secondary)] font-semibold uppercase tracking-wider border-b border-[var(--border-color)]',
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({ className, children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={clsx('divide-y divide-[var(--border-color)] tabular-nums', className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ className, children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={clsx(
        'hover:bg-[var(--bg-surface-hover)] transition-colors duration-150',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ className, children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={clsx('py-3 px-3.5 font-semibold text-xs text-[var(--text-secondary)]', className)} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ className, children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={clsx('py-3 px-3.5 text-xs text-[var(--text-primary)]', className)} {...props}>
      {children}
    </td>
  );
}
