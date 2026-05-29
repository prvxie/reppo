import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Trash2, RefreshCw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const SESSION_KEY = "ivera_admin_session";
const ORDERS_KEY = "ivera_orders";

async function sha256(msg: string): Promise<string> {
  const buf = new TextEncoder().encode(msg);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// SHA-256("iverapriv2025") — override with VITE_ADMIN_HASH env var in Vercel
const ADMIN_HASH =
  import.meta.env.VITE_ADMIN_HASH ||
  "865f8faa1efd8dda391c3334af2da3e8c38d3763b80b17938983c2c540a57a7c";

export interface Order {
  id: string;
  date: string;
  productName: string;
  price: number;
  email: string;
  paymentMethod: string;
  discordUsername?: string;
  status: "pending" | "delivered";
}

function getOrders(): Order[] {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export default function Admin() {
  const [, navigate] = useLocation();
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [konamiSeq, setKonamiSeq] = useState<string[]>([]);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setAuthed(true);
      setOrders(getOrders());
    }
  }, []);

  // Secret sequence: type "UNLOCK" on the login page to reveal a hint
  const [hint, setHint] = useState(false);
  useEffect(() => {
    const unlock = ["u","n","l","o","c","k"];
    const onKey = (e: KeyboardEvent) => {
      setKonamiSeq(prev => {
        const next = [...prev, e.key.toLowerCase()].slice(-unlock.length);
        if (next.join("") === unlock.join("")) {
          setHint(true);
        }
        return next;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleLogin = async () => {
    if (!password) return;
    setLoading(true);
    setError("");
    try {
      const hash = await sha256(password);
      if (hash === ADMIN_HASH) {
        sessionStorage.setItem(SESSION_KEY, "1");
        setAuthed(true);
        setOrders(getOrders());
      } else {
        setError("Access denied.");
      }
    } catch {
      setError("Authentication error.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
    setPassword("");
  };

  const toggleStatus = (id: string) => {
    const updated = orders.map(o =>
      o.id === id ? { ...o, status: o.status === "pending" ? "delivered" : "pending" } as Order : o
    );
    setOrders(updated);
    saveOrders(updated);
  };

  const deleteOrder = (id: string) => {
    const updated = orders.filter(o => o.id !== id);
    setOrders(updated);
    saveOrders(updated);
  };

  const clearAll = () => {
    if (confirm("Clear all orders? This cannot be undone.")) {
      localStorage.removeItem(ORDERS_KEY);
      setOrders([]);
    }
  };

  const refresh = () => setOrders(getOrders());

  const pending = orders.filter(o => o.status === "pending").length;
  const revenue = orders.reduce((s, o) => s + o.price, 0);

  if (!authed) {
    return (
      <div className="min-h-[100dvh] bg-[#030303] text-white flex items-center justify-center font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm space-y-6 px-4"
        >
          <div className="text-center space-y-1">
            <ShieldAlert className="w-8 h-8 text-white/30 mx-auto mb-4" />
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">
              Restricted Access
            </p>
            <h1 className="text-2xl font-black uppercase tracking-tighter">Admin Panel</h1>
          </div>

          <div className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Password"
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 font-mono text-sm px-4 py-3 outline-none focus:border-white/30 transition-colors"
              autoFocus
              data-testid="admin-password"
            />
            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-white text-black hover:bg-white/90 rounded-none font-bold uppercase tracking-widest h-11 disabled:opacity-40"
              data-testid="admin-login"
            >
              {loading ? "Verifying..." : "Enter"}
            </Button>
            {error && (
              <p className="text-[11px] font-mono text-red-400 text-center uppercase tracking-widest">
                {error}
              </p>
            )}
          </div>

          <AnimatePresence>
            {hint && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[10px] font-mono text-white/20 text-center"
              >
                Default: iverapriv2025 — change via VITE_ADMIN_HASH
              </motion.p>
            )}
          </AnimatePresence>

          <button
            onClick={() => navigate("/")}
            className="w-full text-[10px] font-mono text-white/20 uppercase tracking-widest hover:text-white/40 transition-colors"
          >
            ← Back
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#030303] text-white font-sans">
      {/* Admin navbar */}
      <div className="sticky top-0 z-50 border-b border-white/8 bg-[#030303]/90 backdrop-blur-md px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-white font-black uppercase tracking-tighter text-lg">ivera<span className="text-white/25">.priv</span></span>
          <span className="text-[9px] font-mono text-white/30 border border-white/10 px-2 py-0.5 uppercase tracking-widest">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={refresh} className="text-white/30 hover:text-white transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-[10px] font-mono text-white/30 hover:text-white uppercase tracking-widest transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Orders", value: orders.length },
            { label: "Pending", value: pending },
            { label: "Revenue", value: `$${revenue.toFixed(2)}` },
          ].map(s => (
            <div key={s.label} className="border border-white/8 bg-white/3 p-5">
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-2">{s.label}</p>
              <p className="text-3xl font-black text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Orders table */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black uppercase tracking-tighter text-white">Orders</h2>
          {orders.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-[10px] font-mono text-white/30 hover:text-red-400 uppercase tracking-widest transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="border border-white/8 p-16 text-center">
            <p className="font-mono text-xs text-white/20 uppercase tracking-widest">No orders yet.</p>
            <p className="font-mono text-[10px] text-white/10 mt-2">Orders placed via Buy Now will appear here.</p>
          </div>
        ) : (
          <div className="border border-white/8 overflow-hidden">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-white/8 bg-white/3">
                  {["Date","Product","Price","Email","Payment","Discord","Status",""].map(h => (
                    <th key={h} className="text-left text-white/30 uppercase tracking-widest px-4 py-3 font-bold text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/2 transition-colors"
                  >
                    <td className="px-4 py-3 text-white/40">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-white font-bold">{order.productName}</td>
                    <td className="px-4 py-3 text-white">${order.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-white/70">{order.email}</td>
                    <td className="px-4 py-3">
                      <span className="border border-white/15 px-2 py-0.5 text-white/60 uppercase">{order.paymentMethod}</span>
                    </td>
                    <td className="px-4 py-3 text-white/40">{order.discordUsername || "—"}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(order.id)}
                        className={`px-2 py-0.5 text-[10px] uppercase tracking-widest border transition-all ${
                          order.status === "delivered"
                            ? "border-white/30 text-white bg-white/10"
                            : "border-yellow-500/30 text-yellow-400 bg-yellow-400/5"
                        }`}
                      >
                        {order.status}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="text-white/20 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
