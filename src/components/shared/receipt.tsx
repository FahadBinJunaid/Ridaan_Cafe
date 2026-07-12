"use client";

type ReceiptItem = {
  name: string;
  quantity: number;
  price: number;
};

type ReceiptProps = {
  referenceNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  notes: string | null;
  items: ReceiptItem[];
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
};

export default function Receipt({
  referenceNumber,
  customerName,
  customerPhone,
  deliveryAddress,
  notes,
  items,
  totalAmount,
  orderStatus,
  createdAt,
}: ReceiptProps) {
  return (
    <div className="mx-auto max-w-lg">
      <div
        id="receipt-content"
        className="rounded-lg border border-border bg-card p-6 shadow-sm"
      >
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-foreground">
            Rindaan Cafe &amp; Cuisine
          </h2>
          <p className="text-sm text-muted-foreground">Order Receipt</p>
        </div>

        <div className="mb-6 space-y-1 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Order #:</span>{" "}
            {referenceNumber}
          </p>
          <p>
            <span className="font-semibold text-foreground">Date:</span>{" "}
            {new Date(createdAt).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </p>
          <p>
            <span className="font-semibold text-foreground">Status:</span>{" "}
            {orderStatus}
          </p>
        </div>

        <div className="mb-6 space-y-1 text-sm">
          <p>
            <span className="font-semibold text-foreground">Name:</span>{" "}
            {customerName}
          </p>
          <p>
            <span className="font-semibold text-foreground">Phone:</span>{" "}
            {customerPhone}
          </p>
          <p>
            <span className="font-semibold text-foreground">Deliver to:</span>{" "}
            {deliveryAddress}
          </p>
          {notes && (
            <p>
              <span className="font-semibold text-foreground">Notes:</span>{" "}
              {notes}
            </p>
          )}
        </div>

        <table className="mb-6 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="pb-2 font-medium">Item</th>
              <th className="pb-2 text-right font-medium">Qty</th>
              <th className="pb-2 text-right font-medium">Price</th>
              <th className="pb-2 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-b border-border/50">
                <td className="py-2 text-foreground">{item.name}</td>
                <td className="py-2 text-right text-foreground">
                  {item.quantity}
                </td>
                <td className="py-2 text-right text-foreground">
                  Rs. {item.price.toFixed(2)}
                </td>
                <td className="py-2 text-right text-foreground">
                  Rs. {(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mb-6 flex items-center justify-between border-t border-border pt-4">
          <span className="text-lg font-bold text-foreground">Total</span>
          <span className="text-lg font-bold text-primary">
            Rs. {totalAmount.toFixed(2)}
          </span>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Payment Method: Cash on Delivery
        </p>
      </div>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Print Receipt
        </button>
      </div>
    </div>
  );
}
