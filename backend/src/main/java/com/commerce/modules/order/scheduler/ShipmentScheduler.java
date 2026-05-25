package com.commerce.modules.order.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.commerce.modules.order.service.ShipmentService;

@Service
public class ShipmentScheduler {

    private final ShipmentService shipmentService;

    public ShipmentScheduler(ShipmentService shipmentService) {
        this.shipmentService = shipmentService;
    }

    @Scheduled(fixedDelayString = "${commerce.fulfillment.auto-complete.fixed-delay-ms:300000}")
    public void scheduledAutoComplete() {
        shipmentService.autoComplete();
    }
}
