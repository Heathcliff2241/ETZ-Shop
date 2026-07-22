'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MyOrders from '../../components/MyOrders';
import { useApp } from '../../providers/AppProvider';

export default function MyOrdersPage() {
  const router = useRouter();
  const { orders } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Header currentPage="my-orders" />
      <main className="flex-grow pt-20 sm:pt-24 px-4 sm:px-6 max-w-4xl mx-auto w-full pb-16">
        <MyOrders
          orders={orders}
          onNavigate={(page) => router.push(`/${page}`)}
        />
      </main>
      <Footer />
    </div>
  );
}
