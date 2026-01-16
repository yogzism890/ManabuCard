import { prisma } from "../prisma";

export const createCard = (koleksiId: string, front: string, back: string) => {
  return prisma.kartu.create({
    data: { koleksiId, front, back }
  });
}
