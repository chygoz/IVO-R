"use client";
import React, { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

type PageHeaderProps = {
  title: React.ReactNode | string;
  subtitle?: string;
  currentTitle?: string
  showTitle?: boolean;
  navigation?: { id: number; href: string; name: string }[];
};

function PageHeader({
  title,
  subtitle,
  showTitle,
  currentTitle,
  navigation,
}: PageHeaderProps) {
  const pathname = usePathname();
  const path = pathname.split("/");
  let currentPath = "";
  if (path.length > 3) {
    currentPath = path[2];
  }
  return (
    <div className="flex flex-col gap-2">
      <div>
        {showTitle === false ? null : (
          <h4 className="text-base md:text-xl font-medium capitalize text-black">
            {title}
          </h4>
        )}
        {subtitle ? <h5>{subtitle}</h5> : null}
      </div>
      <Breadcrumb>
        <BreadcrumbList className="text-xs">
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
          </BreadcrumbItem>
          {navigation?.length ? (
            navigation.map((nav, index) => {
              if (index !== navigation.length - 1) {
                return (
                  <Fragment key={nav.id}>
                    <BreadcrumbSeparator>/</BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <BreadcrumbLink className="capitalize" href={nav.href}>
                        {nav.name}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </Fragment>
                );
              }
              return (
                <Fragment key={nav.id}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink className="capitalize">
                      {nav.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </Fragment>
              );
            })
          ) : currentPath ? (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="capitalize"
                  href={`/admin/${currentPath}`}
                >
                  {currentPath}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {typeof title === "string" && (
                <BreadcrumbItem>
                  <BreadcrumbLink className="capitalize">
                    {currentTitle ? currentTitle : title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              )}
            </>
          ) : (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink className="capitalize">{title}</BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

export default PageHeader;
