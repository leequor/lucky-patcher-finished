"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { logoutAction } from "@/app/actions/auth";
import { Logo } from "@/components/ui/logo";
import type { AuthUser } from "@/lib/auth/types";
import { ROLE_LABELS } from "@/lib/repair/format";
import { initials } from "@/lib/utils";

import {
  ArrowUpRightIcon,
  CloseIcon,
  CustomersIcon,
  DashboardIcon,
  InventoryIcon,
  InvoiceIcon,
  LogoutIcon,
  MenuIcon,
  PlusIcon,
  TeamIcon,
  TicketIcon,
} from "./icons";

const NAV = [
  { href: "/", label: "Overview", icon: DashboardIcon },
  { href: "/tickets", label: "Tickets", icon: TicketIcon },
  { href: "/customers", label: "Customers", icon: CustomersIcon },
  { href: "/inventory", label: "Inventory", icon: InventoryIcon },
  { href: "/invoices", label: "Invoices", icon: InvoiceIcon },
  { href: "/team", label: "Team", icon: TeamIcon },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function WorkspaceShell({
  user,
  children,
}: {
  user: AuthUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const displayName = user.fullName || user.email;
  const avatar = initials(displayName) || "C";

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-[72px] items-center justify-between border-b border-line px-5">
        <div onClick={() => setOpen(false)}>
          <Logo />
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="grid h-8 w-8 place-items-center border border-line text-muted hover:text-ink lg:hidden"
          aria-label="Close navigation"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="px-3 pt-5">
        <Link
          href="/tickets/new"
          onClick={() => setOpen(false)}
          className="flex h-10 items-center justify-between gap-2 bg-accent px-3 text-[13px] font-semibold text-[#09090B] transition-colors hover:bg-[#FF7F4D]"
        >
          New ticket
          <PlusIcon className="h-4 w-4" />
        </Link>
      </div>

      <nav className="mt-7 flex-1 px-3" aria-label="Main navigation">
        <p className="px-2 pb-2 text-[12px] text-muted">Workspace</p>
        {NAV.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={
                active
                  ? "flex h-9 items-center gap-3 border-l-2 border-accent bg-white/5 pl-2 text-[13px] font-medium text-ink"
                  : "flex h-9 items-center gap-3 border-l-2 border-transparent pl-2 text-[13px] text-muted transition-colors hover:bg-white/5 hover:text-ink"
              }
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-[15px] w-[15px] stroke-[1.5]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-line">
        <Link
          href="/track"
          onClick={() => setOpen(false)}
          className="flex h-10 items-center justify-between px-5 text-[12.5px] text-muted transition-colors hover:text-ink"
        >
          Public tracker
          <ArrowUpRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="border-t border-line p-3">
        <div className="flex items-center gap-2.5 px-1 py-1">
          <div className="grid h-8 w-8 shrink-0 place-items-center bg-white/10 text-[12px] font-semibold text-ink">
            {avatar}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-ink">{displayName}</p>
            <p className="mt-0.5 truncate text-[12px] text-muted">{ROLE_LABELS[user.role]}</p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="grid h-8 w-8 place-items-center border border-transparent text-muted transition-colors hover:border-line hover:text-ink"
              aria-label="Log out"
              title="Log out"
            >
              <LogoutIcon className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-paper">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[244px] border-r border-line bg-paper lg:block">
        {sidebar}
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/55"
            aria-label="Close navigation overlay"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[280px] border-r border-line bg-paper">
            {sidebar}
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-[244px]">
        <header className="flex h-14 items-center gap-3 border-b border-line bg-paper px-4 sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="grid h-8 w-8 place-items-center border border-line text-muted hover:text-ink"
            aria-label="Open navigation"
          >
            <MenuIcon className="h-4 w-4" />
          </button>
          <div className="ml-1">
            <Logo />
          </div>
          <form action={logoutAction} className="ml-auto">
            <button
              type="submit"
              className="grid h-8 w-8 place-items-center border border-line text-muted hover:text-ink"
              aria-label="Log out"
              title="Log out"
            >
              <LogoutIcon className="h-4 w-4" />
            </button>
          </form>
        </header>

        <main className="mx-auto w-full max-w-canvas px-4 pb-20 pt-6 sm:px-6 sm:pt-8 lg:pt-9">
          {children}
        </main>
      </div>
    </div>
  );
}
