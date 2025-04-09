// attributeOption.interface.ts - attributeOption module
export interface IAttributeOption {
    name: string;
    type: "color" | "other";
    colorCode?: string;
    status: string;
    isDelete: boolean;
  }
  