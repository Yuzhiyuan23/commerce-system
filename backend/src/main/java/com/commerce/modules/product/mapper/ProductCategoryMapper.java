package com.commerce.modules.product.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.commerce.modules.product.entity.ProductCategoryEntity;

@Mapper
public interface ProductCategoryMapper extends BaseMapper<ProductCategoryEntity> {
}
