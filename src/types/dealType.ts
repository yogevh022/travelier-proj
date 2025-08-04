export type DealType = {
    _id: string;
    client: string;
    name: string;
    status: "draft" | "active" | "paused" | "closed";
    start_date: string;
    end_date: string;
};

export type NewDealType = Omit<DealType, "_id">;