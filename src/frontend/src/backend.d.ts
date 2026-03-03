import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Sticker {
    id: string;
    pinterestLink: string;
    title: string;
    featured: boolean;
    amazonLink: string;
    createdAt: Time;
    description: string;
    imageUrl: string;
    category: string;
    price: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addSticker(sticker: Sticker): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteSticker(id: string): Promise<void>;
    getAllStickers(): Promise<Array<Sticker>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeaturedStickers(): Promise<Array<Sticker>>;
    getStickerById(id: string): Promise<Sticker | null>;
    getStickersByCategory(category: string): Promise<Array<Sticker>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedStickers(): Promise<void>;
    toggleFeatured(id: string): Promise<void>;
    updateSticker(sticker: Sticker): Promise<void>;
}
