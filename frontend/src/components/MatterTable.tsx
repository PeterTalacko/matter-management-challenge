import { CurrencyValue, Matter } from "../types/matter";
import {
  formatBoolean,
  formatCurrency,
  formatDate,
  getSLABadgeColor,
  getStatusBadgeColor,
} from "../utils/formatting";

interface MatterTableProps {
  matters: Matter[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (column: string) => void;
}

export function MatterTable({
  matters,
  sortBy,
  sortOrder,
  onSort,
}: MatterTableProps) {
  const renderSortIcon = (column: string) => {
    if (sortBy !== column) {
      return (
        <svg
          className='w-4 h-4 text-gray-400'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4'
          />
        </svg>
      );
    }

    return sortOrder === "asc" ? (
      <svg
        className='w-4 h-4 text-blue-600'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M5 15l7-7 7 7'
        />
      </svg>
    ) : (
      <svg
        className='w-4 h-4 text-blue-600'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M19 9l-7 7-7-7'
        />
      </svg>
    );
  };

  const renderFieldValue = (matter: Matter, fieldName: string) => {
    const field = matter.fields[fieldName];
    if (!field) return <span className='text-gray-400'>N/A</span>;

    switch (field.fieldType) {
      case "currency":
        return (
          <span className='font-medium'>
            {formatCurrency(field.value as CurrencyValue | null)}
          </span>
        );

      case "date":
        return <span>{formatDate(field.value as string | null)}</span>;

      case "boolean":
        return (
          <span className={field.value ? "text-green-600" : "text-gray-400"}>
            {formatBoolean(field.value as boolean | null)}
          </span>
        );

      case "status":
        return (
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
              field.displayValue || ""
            )}`}
          >
            {field.displayValue}
          </span>
        );

      case "user":
        return <span>{field.displayValue}</span>;

      default:
        return (
          <span>{field.displayValue || String(field.value) || "N/A"}</span>
        );
    }
  };

  if (matters.length === 0) {
    return (
      <div className='text-center py-12'>
        <svg
          className='mx-auto h-12 w-12 text-gray-400'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
          />
        </svg>
        <h3 className='mt-2 text-sm font-medium text-gray-900'>
          No matters found
        </h3>
        <p className='mt-1 text-sm text-gray-500'>
          Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th
              onClick={() => onSort("subject")}
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
            >
              <div className='flex items-center gap-1'>
                Subject
                {renderSortIcon("subject")}
              </div>
            </th>
            <th
              onClick={() => onSort("case_number")}
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
            >
              <div className='flex items-center gap-1'>
                Case Number
                {renderSortIcon("case_number")}
              </div>
            </th>
            <th
              onClick={() => onSort("status")}
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
            >
              <div className='flex items-center gap-1'>
                Status
                {renderSortIcon("status")}
              </div>
            </th>
            <th
              onClick={() => onSort("assigned_to")}
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
            >
              <div className='flex items-center gap-1'>
                Assigned To
                {renderSortIcon("assigned_to")}
              </div>
            </th>
            <th
              onClick={() => onSort("priority")}
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
            >
              <div className='flex items-center gap-1'>
                Priority {renderSortIcon("priority")}
              </div>
            </th>
            <th
              onClick={() => onSort("contract_value")}
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
            >
              <div className='flex items-center gap-1'>
                Contract Value {renderSortIcon("contract_value")}
              </div>
            </th>
            <th
              onClick={() => onSort("due_date")}
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
            >
              <div className='flex items-center gap-1'>
                Due Date {renderSortIcon("due_date")}
              </div>
            </th>
            <th
              onClick={() => onSort("urgent")}
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
            >
              <div className='flex items-center gap-1'>
                Urgent {renderSortIcon("urgent")}
              </div>
            </th>
            <th
              onClick={() => onSort("resolution_time")}
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
            >
              <div className='flex items-center gap-1'>
                Resolution Time {renderSortIcon("resolution_time")}
              </div>
            </th>
            <th
              onClick={() => onSort("sla")}
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
            >
              <div className='flex items-center gap-1'>
                SLA {renderSortIcon("sla")}
              </div>
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {matters.map((matter) => (
            <tr key={matter.id} className='hover:bg-gray-50'>
              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='text-sm font-medium text-gray-900'>
                  {renderFieldValue(matter, "subject")}
                </div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {renderFieldValue(matter, "Case Number")}
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                {renderFieldValue(matter, "Status")}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {renderFieldValue(matter, "Assigned To")}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {renderFieldValue(matter, "Priority")}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {renderFieldValue(matter, "Contract Value")}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {renderFieldValue(matter, "Due Date")}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-center'>
                {renderFieldValue(matter, "Urgent")}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-400'>
                {/* TODO: Display formatted resolution time (e.g., "2h 30m", "3d 5h") */}
                <span className='italic'>
                  {matter.cycleTime?.resolutionTimeFormatted}
                </span>
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                {/* TODO: Display SLA badge (In Progress/Met/Breached) with appropriate colors */}
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getSLABadgeColor(
                    matter.sla
                  )}`}
                >
                  {matter.sla}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
