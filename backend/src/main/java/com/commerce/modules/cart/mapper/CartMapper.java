package com.commerce.modules.cart.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.commerce.modules.cart.entity.CartEntity;

@Mapper
public interface CartMapper extends BaseMapper<CartEntity> {
}
