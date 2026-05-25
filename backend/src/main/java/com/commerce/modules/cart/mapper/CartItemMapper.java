package com.commerce.modules.cart.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.commerce.modules.cart.entity.CartItemEntity;

@Mapper
public interface CartItemMapper extends BaseMapper<CartItemEntity> {
}
