import { prisma } from "../prisma";

export const createCard = (deckId: string, front: string, back: string) => {
  return prisma.card.create({
    data: { deckId, front, back }
  });
}
