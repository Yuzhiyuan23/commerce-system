package com.commerce.modules.logging.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.commerce.modules.logging.entity.ProductViewLogEntity;

@Mapper
public interface ProductViewLogMapper extends BaseMapper<ProductViewLogEntity> {
}
