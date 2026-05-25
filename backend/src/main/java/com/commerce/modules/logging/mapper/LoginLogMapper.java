package com.commerce.modules.logging.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.commerce.modules.logging.entity.LoginLogEntity;

@Mapper
public interface LoginLogMapper extends BaseMapper<LoginLogEntity> {
}
