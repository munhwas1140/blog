"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // 서버에서 초기 렌더링 시 스타일 수집
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    // 서버에서 수집된 스타일을 HTML에 주입
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  // 클라이언트에서는 일반적인 렌더링
  if (typeof window !== "undefined") {
    return <>{children}</>;
  }

  // 서버에서는 스타일을 수집
  return (
    <StyleSheetManager
      sheet={styledComponentsStyleSheet.instance}
      enableVendorPrefixes
    >
      {children}
    </StyleSheetManager>
  );
}
