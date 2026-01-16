import React, { Suspense, lazy as reactLazy } from "react";

// A wrapper around React.lazy that allows for default exports
export const lazy = (importer: () => Promise<{ default: React.ComponentType<any>; }>) => {
  const Component = reactLazy(importer);
  return (props: any) => (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );
};