/**
 * Card Type Definitions for ManabuCard
 */

// Card content types
export type CardType = "TEXT" | "IMAGE";

// Base card interface
export interface BaseCard {
  id: string;
  koleksiId: string;
  type: CardType;
  difficulty: number;
  reviewDueAt: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
  isDeleted: boolean;
}

// Text card content
export interface TextCardContent {
  frontText: string;
  backText: string;
}

// Image card content
export interface ImageCardContent {
  frontImageUrl: string;
  backImageUrl?: string;
}

// Combined card (all fields)
export interface Card extends BaseCard {
  // Text content
  frontText?: string | null;
  backText?: string | null;
  
  // Image URLs
  frontImageUrl?: string | null;
  backImageUrl?: string | null;
  
  // Legacy fields (for backward compatibility)
  front?: string | null;
  back?: string | null;
}

// Helper function to check if card is text type
export function isTextCard(card: Card): boolean {
  return card.type === "TEXT";
}

// Helper function to check if card is image type
export function isImageCard(card: Card): boolean {
  return card.type === "IMAGE";
}

// Helper to get front content (text or image URL)
export function getFrontContent(card: Card): { text?: string; imageUrl?: string } {
  if (card.type === "IMAGE" && card.frontImageUrl) {
    return { imageUrl: card.frontImageUrl };
  }
  return { text: card.frontText || card.front || "" };
}

// Helper to get back content (text or image URL)
export function getBackContent(card: Card): { text?: string; imageUrl?: string } {
  if (card.type === "IMAGE" && card.backImageUrl) {
    return { imageUrl: card.backImageUrl };
  }
  return { text: card.backText || card.back || "" };
}

// Review mode selection
export type ReviewMode = "TEXT" | "IMAGE" | "ALL";

// Create card payload
export interface CreateCardPayload {
  koleksiId: string;
  type: CardType;
  frontText?: string;
  backText?: string;
  frontImageUrl?: string;
  backImageUrl?: string;
}

// API Response types
export interface UploadResponse {
  url: string;
  filename: string;
}

export interface ApiError {
  error: string;
}

