import React from "react";
import AddIcon from "@mui/icons-material/Add";



const CardLinkButton = ({ onClick, isCn = false }) => {

    return (
        <button
          type="button"
          onClick={onClick}
          onTouchEnd={onClick}
          aria-label={isCn ? "查看更多" : "View more"}
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 17,
            color: "var(--text-primary, #888)",
            padding: 0,
            margin: 0,
            outline: "none",
            transition:
              "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), font-size 0.3s cubic-bezier(0.34,1.56,0.64,1), color 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "rotate(135deg) scale(1.45)";
            e.currentTarget.style.fontSize = "22px";
            e.currentTarget.style.color = "var(--text-primary, #111)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "rotate(0deg) scale(1)";
            e.currentTarget.style.fontSize = "17px";
            e.currentTarget.style.color = "var(--text-primary, #888)";
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "rotate(180deg) scale(1.2)";
          }}
        >
          <AddIcon fontSize="inherit" sx={{ verticalAlign: "middle" }} />
        </button>
  );
};

export default React.memo(CardLinkButton);