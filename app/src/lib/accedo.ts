const ACCEDO_API_BASE = "https://accedotickets.com";

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

export async function getRockwellEvents(): Promise<PublicVenueEvent[]> {
    const res = await fetch(
        `${ACCEDO_API_BASE}/api/public/venues/rockwell-event-center/events`
    );

    if (!res.ok) {
        throw new Error("Failed to load Rockwell events");
    }

    const data = await res.json();
    return data.events || [];
}

export async function getEventBySlug(slug: string): Promise<PublicEventDetail> {
    const res = await fetch(`${ACCEDO_API_BASE}/api/public/events/${slug}`);

    if (!res.ok) {
        throw new Error("Failed to load event");
    }

    const data = await res.json();
    return data.event;
}

export async function getTicketTypesBySlug(
    slug: string
): Promise<PublicTicketType[]> {
    const res = await fetch(
        `${ACCEDO_API_BASE}/api/public/events/${slug}/ticket-types`
    );

    if (!res.ok) {
        throw new Error("Failed to load ticket types");
    }

    const data = await res.json();
    return data.ticketTypes || [];
}

export async function createCheckoutSession(input: {
    eventId: string;
    email?: string;
    items: { ticketTypeId: string; quantity: number }[];
    cancelUrl: string;
}) {
    const idempotencyKey = crypto.randomUUID();

    const res = await fetch(`${ACCEDO_API_BASE}/api/checkout/session`, {
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
            successUrl:
                "https://rockwelleventcenter.com/success?session_id={CHECKOUT_SESSION_ID}",
            cancelUrl: input.cancelUrl,
        }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error || "Failed to create checkout session");
    }

    return data;
}
