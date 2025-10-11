"use client";

import dynamic from 'next/dynamic'

const UserList = dynamic(
  () => import('@/components/users/list'),
  { ssr: false }
)

export default function ListPage() {
  return (
    <UserList />
  );
}
