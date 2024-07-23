import React from 'react';

interface TableProps {
  data: any[];
  columns: {
    header: string;
    accessor?: string; // key from the data, optional for actions
    render?: (item: any) => React.ReactNode; // custom render function for complex cells
  }[];
  uniqueKey: string; // unique key from data to use as React key
}

const Table: React.FC<TableProps> = ({ data, columns, uniqueKey }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 shadow-lg">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th key={column.header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data?.map((item) => (
            <tr key={item[uniqueKey]}>
              {columns.map((column) => (
                <td key={`${item[uniqueKey]}-${column.header}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {column?.render ? column?.render(item) : item[column?.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
