-- SQL to create support_messages table
create extension if not exists pgcrypto;

create table if not exists public.support_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  user_id uuid null,
  created_at timestamptz default now()
);
