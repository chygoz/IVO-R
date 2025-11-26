'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { OrderFilters } from './order-filters';
import { OrdersTable } from './orders-table';
import { Pagination } from '@/components/ui/pagination';
import { OrderType } from '@/types/order';

interface OrdersClientProps {
  orders: OrderType[];
  totalPages: number;
  currentPage: number;
}

export const OrdersClient = ({ orders, totalPages, currentPage }: OrdersClientProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <OrderFilters />
      <OrdersTable orders={orders} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};