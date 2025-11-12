function Announcement() {
  return (
    <div
      style={{
        width: "100%",
        minWidth: "320px",
        height: "48px",
        backgroundColor: "#000000",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 2rem",
      }}
    >
      <div style={{ flex: 1 }}></div>
      <div style={{ flex: 2, textAlign: "center" }}>
        <span style={{ color: "#FAFAFA", fontFamily: "Poppins", fontSize: "14px" }}>
          Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!{" "}
        </span>
        <span
          style={{
            color: "#FAFAFA",
            fontFamily: "Poppins",
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          ShopNow
        </span>
      </div>
      <div style={{ flex: 1, textAlign: "right" }}>
        <button
          style={{
            color: "#FAFAFA",
            fontFamily: "Poppins",
            fontSize: "14px",
            cursor: "pointer",
            background: "none",
            border: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Icon đã bị xoá vì import không được sử dụng */}
        </button>
      </div>
    </div>
  );
}

export default Announcement;