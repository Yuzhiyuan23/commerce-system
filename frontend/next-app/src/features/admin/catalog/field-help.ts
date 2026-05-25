export type FieldHelpPage = "category" | "productList" | "productEditor";

export type FieldHelpItem = {
  title: string;
  description: string;
};

const FIELD_HELP: Record<FieldHelpPage, Record<string, FieldHelpItem>> = {
  category: {
    name: {
      title: "分类名称",
      description: "用于后台识别和前台展示这个一级分类。请填写商家和运营都能直接理解的业务名称。"
    },
    sortOrder: {
      title: "排序",
      description: "用于控制分类展示顺序。数值越小越靠前，建议按后台和前台希望看到的顺序维护。"
    },
    status: {
      title: "状态",
      description: "用于控制该分类是否还能继续被新商品选用。停用后历史商品仍保留分类归属，但新商品不应继续使用。"
    }
  },
  productList: {
    keyword: {
      title: "关键词",
      description: "用于按商品名称或 SPU 编码快速定位商品。适合在商品较多时先缩小范围再进入编辑。"
    },
    categoryId: {
      title: "分类",
      description: "用于按商品所属一级分类筛选结果。只会过滤商品归属，不会改变商品本身的分类。"
    },
    status: {
      title: "状态",
      description: "用于按草稿、已上架、已下架筛选商品。方便先看可售商品，或集中处理待上架内容。"
    }
  },
  productEditor: {
    categoryId: {
      title: "分类",
      description: "用于指定商品所属的一级分类。商品创建后会按这里的分类进入后台筛选和前台展示。"
    },
    status: {
      title: "商品状态",
      description: "用于控制当前商品是草稿、上架还是下架。状态会直接影响后台管理动作和前台是否可售。"
    },
    name: {
      title: "商品名称",
      description: "这是商品的主名称，会作为后台识别和前台核心展示名称。建议直接写用户能理解的正式商品名。"
    },
    spuCode: {
      title: "SPU 编码",
      description: "这是商品级识别编码，主要供后台管理和系统对接使用。可手工填写，留空时按系统规则自动生成。"
    },
    subtitle: {
      title: "副标题",
      description: "用于补充商品卖点或简要说明。适合写一句帮助运营和用户快速理解商品特点的补充信息。"
    },
    coverImageUrl: {
      title: "封面图 URL",
      description: "用于商品列表和详情主视觉展示。请填写可直接访问的图片地址，而不是本地文件路径。"
    },
    description: {
      title: "商品描述",
      description: "用于保存商品详情说明内容。这里存的是富文本或 HTML 源字符串，不是系统自动生成的简介。"
    },
    detailImageUrl: {
      title: "详情图 URL",
      description: "用于补充商品详情页展示内容。可维护多张图片，并按顺序控制展示先后。"
    },
    detailImageSortOrder: {
      title: "详情图排序",
      description: "用于控制详情图展示顺序。数值越小越靠前，建议和商品详情阅读顺序保持一致。"
    },
    attributeName: {
      title: "展示属性名",
      description: "用于描述不会生成 SKU 的商品展示信息，例如材质或产地。它只负责说明商品，不参与规格组合。"
    },
    attributeValue: {
      title: "展示属性值",
      description: "用于填写展示属性对应的具体内容。请和属性名一一对应，方便后台和前台统一理解。"
    },
    attributeSortOrder: {
      title: "展示属性排序",
      description: "用于控制展示属性的显示顺序。数值越小越靠前，建议按最重要的信息优先展示。"
    },
    salesAttributeName: {
      title: "规格维度名称（如：颜色、尺码）",
      description: "定义商品规格的维度名称，例如：颜色、尺码、容量、版本等。每个商品最多支持 2 个规格维度（如颜色+尺码）。"
    },
    salesAttributeValues: {
      title: "规格选项值（如：黑,白,红）",
      description: "该维度下的具体选项，多个值用英文逗号分隔。例如颜色维度可填：黑色,白色,红色。系统会自动组合所有维度生成规格表。"
    },
    skuCode: {
      title: "规格编码（SKU编码）",
      description: "商品规格的唯一识别码，如：PHONE-001-BLACK-128G。用于库存管理和订单识别，可留空让系统自动生成。"
    },
    skuPrice: {
      title: "规格售价（元）",
      description: "该规格的实际销售价格。不同规格（如不同颜色、容量）可以设置不同价格，商品列表会显示最低价。"
    },
    skuStock: {
      title: "库存数量（件）",
      description: "该规格当前的可用库存数量。用户下单时会扣减对应规格的库存，库存为0时无法购买。"
    },
    skuLowStockThreshold: {
      title: "低库存预警值（件）",
      description: "库存低于此数量时触发预警提醒，方便及时补货。建议设置为日常销量的1-3天库存量。"
    },
    skuStatus: {
      title: "规格上下架状态",
      description: "控制该规格是否可售：上架（ENABLED）表示可正常购买，下架（DISABLED）表示暂停销售但保留数据。"
    }
  }
};

export function getFieldHelp(page: FieldHelpPage, field: string): FieldHelpItem | undefined {
  return FIELD_HELP[page][field];
}
