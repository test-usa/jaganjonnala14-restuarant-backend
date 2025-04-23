import { ObjectId } from "mongoose";

export interface Icategories {
name: string;
slug?: string;
image: string | null;
description?: string;
isActive?: boolean;
isDelete?: boolean;
parentCategory?: ObjectId | null;
}

