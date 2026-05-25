package com.commerce.modules.cart.web;

import static com.commerce.modules.cart.dto.CartDtos.CheckoutSummaryResponse;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.commerce.modules.cart.service.CartService;
import com.commerce.modules.user.security.AuthenticatedUserPrincipal;

@RestController
@RequestMapping("/api/cart/summary")
public class CartSummaryController {

    private final CartService cartService;

    public CartSummaryController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public CheckoutSummaryResponse getCheckoutSummary(Authentication authentication) {
        return cartService.getCheckoutSummary(requireUserId(authentication));
    }

    private Long requireUserId(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUserPrincipal principal)) {
            throw new IllegalStateException("Authenticated user is required");
        }
        return principal.id();
    }
}
