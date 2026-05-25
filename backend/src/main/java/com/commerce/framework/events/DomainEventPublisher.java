package com.commerce.framework.events;

public interface DomainEventPublisher {

    void publish(DomainEvent event);
}
