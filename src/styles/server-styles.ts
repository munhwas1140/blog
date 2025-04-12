// 서버 컴포넌트에서 사용할 공통 스타일 (인라인 스타일 형태)
export const serverStyles = {
  container: {
    maxWidth: "1280px",
    marginLeft: "auto",
    marginRight: "auto",
    paddingLeft: "1rem",
    paddingRight: "1rem",
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
  },
  textCenter: {
    textAlign: "center",
  },
  gutterY: {
    marginTop: "1rem",
    marginBottom: "1rem",
  },
} as const;
