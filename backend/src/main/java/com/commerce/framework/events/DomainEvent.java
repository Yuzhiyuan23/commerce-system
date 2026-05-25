package com.commerce.framework.events;

import java.time.Instant;

public interface DomainEvent {

    String eventType();

    Instant occurredAt();
}
