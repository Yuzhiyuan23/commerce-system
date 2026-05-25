package com.commerce.modules.order.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.commerce.modules.order.entity.OrderEntity;

@Mapper
public interface OrderMapper extends BaseMapper<OrderEntity> {
}
