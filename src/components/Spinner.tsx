export default function Spinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <div
        style={{
          width: "18px",
          height: "18px",
          border: "3px solid #ccc",
          borderTop: "3px solid black",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />

      <span>{text}</span>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
