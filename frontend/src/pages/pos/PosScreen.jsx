import { useMemo, useRef, useState } from "react";
import api from "../../api";
import { toast } from "react-toastify";

export default function PosScreen() {
    const [scanValue, setScanValue] = useState("");
    const [cart, setCart] = useState([]); // [{product_id,name,price,qty}]
    const [discount, setDiscount] = useState(0);
    const [taxPercent, setTaxPercent] = useState(0);
    const [payment, setPayment] = useState("cash");
    const [saving, setSaving] = useState(false);
    const scanRef = useRef(null);

    // ---- Scan / add product ----
    const handleScan = async (e) => {
        e.preventDefault();
        const id = scanValue.trim();
        if (!id) return;

        try {
            const res = await api.get(`/products/${id}`);
            const p = res.data.data;

            setCart((prev) => {
                console.log("prev", prev);
                const found = prev.find((x) => x.product_id === p.id);
                if (found) {
                    return prev.map((x) =>
                        x.product_id === p.id ? { ...x, qty: x.qty + 1 } : x,
                    );
                }
                console.log("prev 1", prev);
                return [
                    ...prev,
                    {
                        product_id: p.id,
                        name: p.name,
                        price: Number(p.price),
                        qty: 1,
                    },
                ];
            });

            toast.success(`₹{p.name} added`);
        } catch (err) {
            toast.error("Product not found");
        } finally {
            setScanValue("");
            scanRef.current?.focus();
        }
    };

    // ---- Cart ops ----
    const incQty = (id) =>
        setCart((prev) =>
            prev.map((x) =>
                x.product_id === id ? { ...x, qty: x.qty + 1 } : x,
            ),
        );

    const decQty = (id) =>
        setCart((prev) =>
            prev
                .map((x) =>
                    x.product_id === id ? { ...x, qty: x.qty - 1 } : x,
                )
                .filter((x) => x.qty > 0),
        );

    const removeItem = (id) =>
        setCart((prev) => prev.filter((x) => x.product_id !== id));

    const clearCart = () => setCart([]);

    // ---- Totals ----
    const totals = useMemo(() => {
        const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
        const tax = (subtotal * Number(taxPercent || 0)) / 100;
        const total = subtotal - Number(discount || 0) + tax;
        return {
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            total: Math.max(total, 0).toFixed(2),
        };
    }, [cart, discount, taxPercent]);

    // ---- Checkout ----
    const handleCheckout = async () => {
        if (cart.length === 0) return toast.error("Cart is empty");
        setSaving(true);
        try {
            const res = await api.post("/orders", {
                items: cart.map((x) => ({
                    product_id: x.product_id,
                    qty: x.qty,
                })),
                discount: Number(discount || 0),
                tax: Number(totals.tax),
                payment_method: payment,
            });
            toast.success(`Order ₹{res.data.data.invoice_no} created`);
            setCart([]);
            setDiscount(0);
            setTaxPercent(0);
            setPayment("cash");
        } catch (err) {
            toast.error("Checkout failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT: scan + cart */}
            <div className="lg:col-span-2 space-y-4">
                <h1 className="text-2xl font-bold">POS — Scan Products</h1>

                <form onSubmit={handleScan} className="flex gap-2">
                    <input
                        ref={scanRef}
                        autoFocus
                        value={scanValue}
                        onChange={(e) => setScanValue(e.target.value)}
                        placeholder="Scan barcode or type product ID, then Enter"
                        className="flex-1 border rounded px-3 py-2"
                    />
                    <button className="px-4 py-2 bg-blue-600 text-white rounded">
                        Add
                    </button>
                </form>

                <div className="bg-white rounded shadow overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3">Product</th>
                                <th className="p-3 w-32">Price</th>
                                <th className="p-3 w-40">Qty</th>
                                <th className="p-3 w-32">Total</th>
                                <th className="p-3 w-16"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((x) => (
                                <tr key={x.product_id} className="border-t">
                                    <td className="p-3">{x.name}</td>
                                    <td className="p-3">
                                        ₹{x.price.toFixed(2)}
                                    </td>
                                    <td className="p-3">
                                        <div className="inline-flex items-center border rounded">
                                            <button
                                                onClick={() =>
                                                    decQty(x.product_id)
                                                }
                                                className="px-3 py-1"
                                            >
                                                −
                                            </button>
                                            <span className="px-3">
                                                {x.qty}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    incQty(x.product_id)
                                                }
                                                className="px-3 py-1"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        ₹{(x.price * x.qty).toFixed(2)}
                                    </td>
                                    <td className="p-3">
                                        <button
                                            onClick={() =>
                                                removeItem(x.product_id)
                                            }
                                            className="text-red-600"
                                        >
                                            ✕
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {cart.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-6 text-center text-gray-500"
                                    >
                                        Scan a product to begin.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {cart.length > 0 && (
                    <button
                        onClick={clearCart}
                        className="text-sm text-red-600 underline"
                    >
                        Clear cart
                    </button>
                )}
            </div>

            {/* RIGHT: totals */}
            <div className="bg-white rounded shadow p-5 h-fit space-y-4">
                <h2 className="text-lg font-semibold">Bill Summary</h2>

                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{totals.subtotal}</span>
                </div>

                <div className="flex justify-between items-center gap-2">
                    <span>Discount (₹)</span>
                    <input
                        type="number"
                        min="0"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className="w-24 border rounded px-2 py-1 text-right"
                    />
                </div>

                <div className="flex justify-between items-center gap-2">
                    <span>Tax (%)</span>
                    <input
                        type="number"
                        min="0"
                        value={taxPercent}
                        onChange={(e) => setTaxPercent(e.target.value)}
                        className="w-24 border rounded px-2 py-1 text-right"
                    />
                </div>

                <div className="flex justify-between">
                    <span>Tax amount</span>
                    <span>₹{totals.tax}</span>
                </div>

                <hr />

                <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{totals.total}</span>
                </div>

                <div>
                    <label className="block mb-1 font-medium">Payment</label>
                    <select
                        value={payment}
                        onChange={(e) => setPayment(e.target.value)}
                        className="w-full border rounded px-3 py-2 bg-white"
                    >
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="upi">UPI</option>
                    </select>
                </div>

                <button
                    onClick={handleCheckout}
                    disabled={saving || cart.length === 0}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded disabled:opacity-50"
                >
                    {saving ? "Processing..." : `Checkout — ₹${totals.total}`}
                </button>
            </div>
        </div>
    );
}
