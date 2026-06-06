import { storage } from "wxt/utils/storage";
import type { CreateMemoItem, MemoItem } from "@/src/types/memo";

export const memoStorage = storage.defineItem<MemoItem[]>("local:memos", {
  fallback: [],
});

export async function addMemo(memo: CreateMemoItem) {
  const currentMemos = await memoStorage.getValue();

  const newMemo: MemoItem = {
    ...memo,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };

  await memoStorage.setValue([newMemo, ...currentMemos]);

  return newMemo;
}

export async function deleteMemo(id: string) {
  const currentMemos = await memoStorage.getValue();

  const nextMemos = currentMemos.filter((memo) => memo.id !== id);

  await memoStorage.setValue(nextMemos);
}

export async function clearMemos() {
  await memoStorage.setValue([]);
}

export async function updateMemo(id: string, text: string) {
  const currentMemos = await memoStorage.getValue();
  const nextMemos = currentMemos.map((memo) =>
    memo.id === id ? { ...memo, memo: text } : memo
  );
  await memoStorage.setValue(nextMemos);
}

export async function getMemos() {
  return await memoStorage.getValue();
}
