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