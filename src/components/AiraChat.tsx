"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { getAiraReply, AIRA_STARTERS, type AiraAction, type AiraCard, type AiraChip } from "@/lib/aira";
import { IconBot, IconSend, IconClose, IconMinus, IconArrowRight } from "./icons";

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  chips?: AiraChip[];
  cards?: AiraCard[];
};

const STORAGE_KEY = "aira:v1";

const WELCOME: Message = {
  id: "welcome",
  role: "bot",
  text: "Hey! I'm AIRA, Edufyi's AI guide. Ask me about any program or career path, or say \"take me to contact\" and I'll get you there.",
  chips: AIRA_STARTERS,
};

function loadSavedSession(): { messages: Message[]; opened: boolean } {
  if (typeof window === "undefined") return { messages: [WELCOME], opened: false };
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { messages: [WELCOME], opened: false };
    const saved = JSON.parse(raw) as { messages?: Message[]; opened?: boolean };
    return {
      messages: saved.messages?.length ? saved.messages : [WELCOME],
      opened: Boolean(saved.opened),
    };
  } catch {
    return { messages: [WELCOME], opened: false }; // sessionStorage unavailable (private mode etc.)
  }
}

/** AIRA — the floating on-site assistant. Runs a fully client-side intent
 *  engine (see lib/aira.ts) so it can redirect users anywhere via
 *  next/navigation without depending on any external chat service. */
export function AiraChat() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => loadSavedSession().messages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(() => loadSavedSession().opened);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Persist this tab's conversation so navigating between pages doesn't reset it.
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, opened: hasOpenedBefore }));
    } catch {
      /* ignore persistence failures */
    }
  }, [messages, hasOpenedBefore]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages, typing, reduceMotion]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 250);
    return () => clearTimeout(t);
  }, [open]);

  function runAction(action: AiraAction) {
    if (action.type === "navigate") {
      router.push(action.href);
    } else if (action.type === "external") {
      window.open(action.href, "_blank", "noopener,noreferrer");
    } else if (action.type === "prompt") {
      send(action.text);
    }
  }

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { id: `${Date.now()}-u`, role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);
    const delay = 380 + Math.random() * 320;
    window.setTimeout(() => {
      const reply = getAiraReply(trimmed);
      setMessages((m) => [
        ...m,
        { id: `${Date.now()}-b`, role: "bot", text: reply.text, chips: reply.chips, cards: reply.cards },
      ]);
      setTyping(false);
    }, delay);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setHasOpenedBefore(true);
        }}
        aria-label={open ? "Close AIRA assistant" : "Open AIRA assistant"}
        aria-expanded={open}
        className="fixed bottom-24 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_10px_30px_-6px_rgba(42,215,234,0.55)] transition-[transform,background-position] duration-500 hover:scale-110 bg-[linear-gradient(325deg,#0b6f9e_0%,#2ad7ea_52%,#0b6f9e_90%)] [background-size:280%_auto] hover:[background-position:100%_center]"
      >
        {open ? <IconClose className="h-6 w-6" /> : <IconBot className="h-7 w-7" />}
        {!open && !hasOpenedBefore && (
          <span
            aria-hidden
            className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-[var(--color-accent-2)] ring-2 ring-[var(--color-background)] animate-pulse-glow"
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="AIRA assistant"
            className="fixed bottom-[9.5rem] right-6 z-50 flex h-[32rem] max-h-[calc(100vh-8rem)] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-[1.25rem] border border-[var(--color-border)] bg-[var(--color-card)] shadow-[var(--shadow-4)]"
          >
            <div className="flex items-center gap-3 border-b border-[var(--color-border)] bg-[linear-gradient(135deg,rgba(22,166,219,0.14),transparent)] px-4 py-3.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(325deg,#0b6f9e_0%,#2ad7ea_90%)] text-white">
                <IconBot className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--color-foreground)]">AIRA</p>
                <p className="flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-2)]" /> Online · Edufyi guide
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Minimize AIRA"
                className="rounded-lg p-1.5 text-[var(--color-muted-foreground)] transition-colors hover:bg-white/5 hover:text-[var(--color-foreground)]"
              >
                <IconMinus className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="scrollbar-hide flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} onAction={runAction} />
              ))}
              {typing && (
                <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-sm bg-[var(--color-background-2)] px-3.5 py-2.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-muted-foreground)] [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-muted-foreground)] [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-muted-foreground)]" />
                </div>
              )}
            </div>

            <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-[var(--color-border)] p-3">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AIRA anything…"
                className="flex-1 rounded-full border border-[var(--color-border)] bg-[var(--color-background-2)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/30"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-transform enabled:hover:scale-105 disabled:opacity-40 bg-[linear-gradient(325deg,#0b6f9e_0%,#2ad7ea_90%)]"
              >
                <IconSend className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MessageBubble({ message, onAction }: { message: Message; onAction: (a: AiraAction) => void }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-[var(--color-primary)] text-white"
            : "rounded-bl-sm bg-[var(--color-background-2)] text-[var(--color-foreground)]"
        }`}
      >
        {message.text}
      </div>

      {message.cards && message.cards.length > 0 && (
        <div className="flex w-full max-w-[92%] flex-col gap-2">
          {message.cards.map((c) => (
            <button
              key={c.href}
              type="button"
              onClick={() => onAction({ type: "navigate", href: c.href })}
              className="flex items-center justify-between gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-background-2)] px-3.5 py-2.5 text-left transition-colors hover:border-[var(--color-primary)]/40"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-[var(--color-foreground)]">{c.title}</span>
                <span className="block text-xs text-[var(--color-muted-foreground)]">{c.subtitle}</span>
              </span>
              <IconArrowRight className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />
            </button>
          ))}
        </div>
      )}

      {message.chips && message.chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {message.chips.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => onAction(c.action)}
              className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-primary)] transition-colors hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/10"
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
