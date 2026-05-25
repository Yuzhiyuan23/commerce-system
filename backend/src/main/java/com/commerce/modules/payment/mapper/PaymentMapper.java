package com.commerce.modules.payment.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.commerce.modules.payment.entity.PaymentEntity;

@Mapper
public interface PaymentMapper extends BaseMapper<PaymentEntity> {
}
