import "./globals.css";

export const metadata = {
  title: "Looply — Recover More Leads. Automatically.",
  description:
    "Looply helps service businesses instantly follow up with new leads so no opportunity is lost."
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

