package com.commerce.modules.product.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.commerce.modules.product.entity.ProductEntity;

@Mapper
public interface ProductMapper extends BaseMapper<ProductEntity> {
}
