"use client";

export function ReceiptPrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="button-primary">
      Download / Print Receipt
    </button>
  );
}
