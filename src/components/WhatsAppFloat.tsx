import { SITE } from "@/lib/config";
import { IconWhatsapp } from "./icons";

/** Persistent WhatsApp contact button — carried over from the live site. */
export function WhatsAppFloat() {
  return (
    <a
      href={SITE.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.7)] transition-transform hover:scale-110"
    >
      <IconWhatsapp className="h-7 w-7" />
    </a>
  );
}
