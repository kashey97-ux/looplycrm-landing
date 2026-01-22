import "./globals.css";

export const metadata = {
  title: "Looply — First‑contact conversion for inbound leads (Auto‑Stop follow‑ups)",
  description:
    "Looply helps roofing & home service businesses convert more inbound leads: sales gets instant alerts + reminders, leads get gentle follow‑ups, and everything auto‑stops the moment an outcome is set.",
  keywords: [
    "lead recovery",
    "inbound leads",
    "roofing CRM",
    "follow-up automation",
    "sales reminders",
    "first contact conversion",
    "lead nurture",
  ],
  openGraph: {
    title: "Looply — First‑contact conversion (Auto‑Stop follow‑ups)",
    description:
      "Sales gets alerted + reminders. Lead gets gentle follow‑ups. Stop instantly when outcome is set. Built for roofing & home services.",
    type: "website",
    siteName: "Looply",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}

