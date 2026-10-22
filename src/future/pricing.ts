/**
 * Later phase: a pricing engine that turns a closed sitting into a quote.
 * Amounts are in pence. Not wired into the screens yet.
 */
export type QuoteLine = {
  label: string;
  amountPence: number;
};

export type Quote = {
  currency: "GBP";
  lines: QuoteLine[];
  totalPence: number;
};

export function quoteTotal(lines: readonly QuoteLine[]): number {
  return lines.reduce((sum, line) => sum + line.amountPence, 0);
}

export function draftQuote(lines: readonly QuoteLine[]): Quote {
  return { currency: "GBP", lines: [...lines], totalPence: quoteTotal(lines) };
}
