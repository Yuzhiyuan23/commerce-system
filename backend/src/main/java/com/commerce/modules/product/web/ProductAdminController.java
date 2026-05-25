package com.commerce.modules.product.web;

import static com.commerce.modules.product.dto.ProductAdminDtos.ProductRequest;
import static com.commerce.modules.product.dto.ProductAdminDtos.ProductResponse;
import static com.commerce.modules.product.dto.ProductAdminDtos.ProductStatusRequest;
import static com.commerce.modules.product.dto.ProductAdminDtos.ProductSummaryResponse;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.commerce.modules.logging.aop.OperationLog;
import com.commerce.modules.product.service.ProductAdminService;
import com.commerce.modules.user.security.AuthenticatedUserPrincipal;

@RestController
@RequestMapping("/api/admin/products")
public class ProductAdminController {

    private final ProductAdminService productAdminService;

    public ProductAdminController(ProductAdminService productAdminService) {
        this.productAdminService = productAdminService;
    }

    @GetMapping
    public List<ProductSummaryResponse> listProducts(
        Authentication authentication,
        @RequestParam(required = false) String name,
        @RequestParam(required = false) Long categoryId,
        @RequestParam(required = false) String status
    ) {
        AuthenticatedUserPrincipal principal = requirePrincipal(authentication);
        // SALES 角色只能看到自己发布的商品，ADMIN 可以看到所有
        Long merchantId = principal.roles().contains("ADMIN") ? null : principal.id();
        return productAdminService.listProducts(name, categoryId, status, merchantId);
    }

    @GetMapping("/{productId}")
    public ProductResponse getProduct(Authentication authentication, @PathVariable Long productId) {
        AuthenticatedUserPrincipal principal = requirePrincipal(authentication);
        ProductResponse product = productAdminService.getProduct(productId);
        // SALES 角色只能查看自己发布的商品
        if (!principal.roles().contains("ADMIN")) {
            productAdminService.verifyProductOwnership(productId, principal.id());
        }
        return product;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @OperationLog(action = "CREATE_PRODUCT", targetType = "PRODUCT", targetIdExpr = "#result.id")
    public ProductResponse createProduct(Authentication authentication, @Valid @RequestBody ProductRequest request) {
        AuthenticatedUserPrincipal principal = requirePrincipal(authentication);
        return productAdminService.createProduct(request, principal.id());
    }

    @PutMapping("/{productId}")
    @OperationLog(action = "UPDATE_PRODUCT", targetType = "PRODUCT", targetIdExpr = "#productId")
    public ProductResponse updateProduct(Authentication authentication, @PathVariable Long productId, @Valid @RequestBody ProductRequest request) {
        AuthenticatedUserPrincipal principal = requirePrincipal(authentication);
        // SALES 角色只能编辑自己发布的商品
        if (!principal.roles().contains("ADMIN")) {
            productAdminService.verifyProductOwnership(productId, principal.id());
        }
        return productAdminService.updateProduct(productId, request);
    }

    @PutMapping("/{productId}/status")
    @OperationLog(action = "UPDATE_PRODUCT", targetType = "PRODUCT", targetIdExpr = "#productId")
    public ProductResponse updateProductStatus(Authentication authentication, @PathVariable Long productId, @Valid @RequestBody ProductStatusRequest request) {
        AuthenticatedUserPrincipal principal = requirePrincipal(authentication);
        // SALES 角色只能修改自己发布的商品状态
        if (!principal.roles().contains("ADMIN")) {
            productAdminService.verifyProductOwnership(productId, principal.id());
        }
        return productAdminService.updateProductStatus(productId, request);
    }

    @DeleteMapping("/{productId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @OperationLog(action = "DELETE_PRODUCT", targetType = "PRODUCT", targetIdExpr = "#productId")
    public void deleteProduct(Authentication authentication, @PathVariable Long productId) {
        AuthenticatedUserPrincipal principal = requirePrincipal(authentication);
        // SALES 角色只能删除自己发布的商品
        if (!principal.roles().contains("ADMIN")) {
            productAdminService.verifyProductOwnership(productId, principal.id());
        }
        productAdminService.deleteProduct(productId);
    }

    private AuthenticatedUserPrincipal requirePrincipal(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUserPrincipal principal)) {
            throw new AccessDeniedException("未登录");
        }
        return principal;
    }
}
