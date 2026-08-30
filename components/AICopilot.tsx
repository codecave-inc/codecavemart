"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function AICopilot({
  productSlug,
  productName,
}: {
  productSlug: string;
  productName: string;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I can help with technical specs, fit, or finding alternatives for the ${productName}. What's on your mind?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          // Skip the canned opening line — the API only needs real turns.
          messages: nextMessages.slice(1),
        }),
      });
      const data = await res.json();

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: res.ok ? data.reply : data.error || "Something went wrong.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Something went wrong reaching the co-pilot." },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          className="w-[320px] md:w-[380px] rounded-xl overflow-hidden flex flex-col shadow-2xl border border-secondary-fixed-dim/30"
          style={{
            background: "rgba(32, 32, 32, 0.85)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="bg-primary-container p-3 flex justify-between items-center border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim" />
              <span className="text-sm font-semibold text-on-primary-container">
                AI Co-pilot
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="text-on-primary-container hover:text-secondary-fixed-dim transition-colors text-lg leading-none"
            >
              ×
            </button>
          </div>

          <div
            ref={scrollRef}
            className="h-[300px] overflow-y-auto p-4 bg-surface-container-lowest text-sm space-y-3"
          >
            {messages.map((m, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-secondary-fixed-dim">
                  {m.role === "assistant" ? "Co-pilot" : "You"}
                </span>
                <div
                  className={`p-2.5 rounded-lg border text-on-surface whitespace-pre-wrap ${
                    m.role === "assistant"
                      ? "bg-surface-container-high border-outline-variant/50"
                      : "bg-secondary-container/10 border-secondary-fixed-dim/30"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-secondary-fixed-dim">
                  Co-pilot
                </span>
                <div className="p-2.5 rounded-lg border border-outline-variant/50 bg-surface-container-high text-on-surface-variant text-sm">
                  Thinking…
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-surface-container border-t border-outline-variant">
            <div className="relative flex items-center">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
                placeholder="Ask about fit, specs, or alternatives…"
                className="w-full bg-surface-container-highest border border-outline-variant rounded-full py-2 pl-4 pr-10 text-sm text-on-surface outline-none focus:border-secondary-fixed-dim focus:ring-1 focus:ring-secondary-fixed-dim"
              />
              <button
                type="button"
                onClick={send}
                disabled={sending || !input.trim()}
                aria-label="Send"
                className="absolute right-3 text-secondary-fixed-dim hover:scale-110 transition-transform disabled:opacity-40"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close AI Co-pilot" : "Open AI Co-pilot"}
        className="w-12 h-12 rounded-full bg-primary-container border border-secondary-fixed-dim flex items-center justify-center text-secondary-fixed-dim transition-all duration-300"
        style={{
          boxShadow: open
            ? "0 0 25px rgba(0,219,233,0.5)"
            : "0 0 15px rgba(0,219,233,0.3)",
        }}
      >
        {open ? "×" : "✦"}
      </button>
    </div>
  );
}
