export type PublicVenueEvent = {
    id: string;
    slug: string;
    title: string;
    dateISO: string;
    doorsISO: string | null;
    agePolicy: string | null;
    description: string;
    poster_url: string | null;
    venue: {
        name: string;
        city: string;
        state: string;
    };
    startingPriceCents: number | null;
    hasTicketsAvailable: boolean;
    buyUrl: string;
};

export type PublicEventDetail = {
    id: string;
    slug: string;
    title: string;
    dateISO: string;
    doorsISO: string | null;
    agePolicy: string | null;
    description: string;
    poster_url: string | null;
    venue: {
        name: string;
        city: string;
        state: string;
    };
};

export type PublicTicketType = {
    id: string;
    name: string;
    priceCents: number;
    inventory: number;
    sold: number;
    remaining: number;
    status: string;
    isAvailable: boolean;
};

export type SuccessTicketLink = {
    ticketId?: string;
    index?: number;
    appleWalletUrl?: string | null;
    googleWalletUrl?: string | null;
    pdfUrl?: string | null;
    passUrl?: string | null;
};

export type OrderBySessionResponse = {
    status: string;
    eventTitle: string;
    venue: string;
    dateISO: string | null;
    email: string | null;
    appleWalletUrl?: string | null;
    googleWalletUrl?: string | null;
    pdfUrl?: string | null;
    tickets?: SuccessTicketLink[];
};

type CheckoutInput = {
    eventId: string;
    email?: string;
    items: { ticketTypeId: string; quantity: number }[];
    cancelUrl: string;
};

type CheckoutResponse = {
    url: string;
};

async function readJsonOrThrow(res: Response) {
    const data = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(data?.error || `Request failed (${res.status})`);
    }

    return data;
}

export async function getRockwellEvents(): Promise<PublicVenueEvent[]> {
    const res = await fetch("/api/events");
    const data = await readJsonOrThrow(res);
    return Array.isArray(data) ? data : [];
}

export async function getEventBySlug(slug: string): Promise<PublicEventDetail> {
    const res = await fetch(`/api/events/${encodeURIComponent(slug)}`);
    const data = await readJsonOrThrow(res);

    if (!data?.event) {
        throw new Error("Event not found");
    }

    return data.event;
}

export async function getTicketTypesBySlug(
    slug: string
): Promise<PublicTicketType[]> {
    const res = await fetch(
        `/api/events/${encodeURIComponent(slug)}/ticket-types`
    );
    const data = await readJsonOrThrow(res);
    return data.ticketTypes || [];
}

export async function fetchOrderBySession(
    sessionId: string
): Promise<OrderBySessionResponse> {
    const res = await fetch(
        `/api/orders/by-session/${encodeURIComponent(sessionId)}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            credentials: "include",
        }
    );

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
        throw new Error(data?.error || `HTTP ${res.status}`);
    }

    return {
        status: String(data?.status || ""),
        eventTitle: String(data?.eventTitle || ""),
        venue: data?.location?.name || "",
        dateISO: data?.dateISO ?? null,
        email: data?.email ?? null,
        appleWalletUrl:
            data?.appleWalletUrl ?? data?.apple_wallet_url ?? null,
        googleWalletUrl:
            data?.googleWalletUrl ?? data?.google_wallet_url ?? null,
        pdfUrl: data?.pdfUrl ?? data?.pdf_url ?? null,
        tickets: Array.isArray(data?.tickets)
            ? data.tickets.map((t: any, idx: number) => ({
                  ticketId: t?.ticketId ?? t?.id ?? String(idx),
                  index: t?.index ?? idx + 1,
                  appleWalletUrl:
                      t?.appleWalletUrl ?? t?.apple_wallet_url ?? null,
                  googleWalletUrl:
                      t?.googleWalletUrl ?? t?.google_wallet_url ?? null,
                  pdfUrl: t?.pdfUrl ?? t?.pdf_url ?? null,
                  passUrl: t?.passUrl ?? t?.pass_url ?? null,
              }))
            : [],
    };
}

export async function createCheckoutSession(
    input: CheckoutInput
): Promise<CheckoutResponse> {
    const idempotencyKey = crypto.randomUUID();

    const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            eventId: input.eventId,
            email: input.email,
            items: input.items,
            idempotencyKey,
            storefront: "rockwell-event-center",
            successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: input.cancelUrl,
        }),
    });

    const data = await readJsonOrThrow(res);

    if (!data?.url) {
        throw new Error("Missing checkout URL");
    }

    return data;
}