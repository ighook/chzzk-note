import { useEffect, useRef, useState } from "react";
import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { addMemo } from "@/src/stores/memoStorage";
import styles from "./memoPopup.module.css";

interface MemoPopupProps {
  channelName: string;
  elapsedTime: string;
  title: string;
  onClose: () => void;
  onSave: (memo: string) => void | Promise<void>;
}

export function MemoPopup({
  channelName,
  elapsedTime,
  title,
  onClose,
  onSave,
}: MemoPopupProps) {
  const [memo, setMemo] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSave = async () => {
    const trimmedMemo = memo.trim();

    if (!trimmedMemo) {
      return;
    }

    await onSave(trimmedMemo);
  };

  return (
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div
        className={styles.popup}
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles["meta-line"]}>
            <span className={styles.time}>{elapsedTime || "00:00:00"}</span>
            <span className={styles.channel}>
              {channelName || "Unknown channel"}
            </span>
          </div>
          <button className={styles["close-button"]} type="button" onClick={onClose}>
            x
          </button>
        </div>
        {title && <div className={styles.title}>{title}</div>}
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={memo}
          placeholder="메모를 입력해주세요."
          rows={1}
          onChange={(event) => setMemo(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void handleSave();
            }
          }}
        />
        <div className={styles.actions}>
          <button className={styles["cancel-button"]} type="button" onClick={onClose}>
            취소
          </button>
          <button
            className={styles["save-button"]}
            type="button"
            disabled={!memo.trim()}
            onClick={() => void handleSave()}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

let memoPopupRoot: Root | null = null;
let memoPopupContainer: HTMLDivElement | null = null;

export function openMemoPopup() {
  const broadcastInfo = getBroadcastInfo();

  closeMemoPopup();

  memoPopupContainer = document.createElement("div");
  document.body.append(memoPopupContainer);
  memoPopupRoot = createRoot(memoPopupContainer);

  memoPopupRoot.render(
    React.createElement(MemoPopup, {
      title: broadcastInfo.title,
      channelName: broadcastInfo.channelName,
      elapsedTime: broadcastInfo.streamTime,
      onClose: closeMemoPopup,
      onSave: async (memo: string) => {
        await addMemo({
          channelId: broadcastInfo.channelName,
          channelName: broadcastInfo.channelName,
          elapsedTime: broadcastInfo.streamTime,
          memo,
        });
        closeMemoPopup();
      },
    }),
  );
}

function closeMemoPopup() {
  memoPopupRoot?.unmount();
  memoPopupRoot = null;
  memoPopupContainer?.remove();
  memoPopupContainer = null;
}

interface BroadcastInfo {
  title: string;
  channelName: string;
  streamTime: string;
}

function getBroadcastInfo(): BroadcastInfo {
  const container = document.querySelector(
    '[class^="live_information_container"]',
  );

  if (!container) {
    return {
      title: "",
      channelName: "",
      streamTime: "",
    };
  }

  const title =
    container
      .querySelector('[class^="video_information_title"]')
      ?.textContent?.trim() ?? "";

  const channelName =
    container.querySelector('[class^="name_text"]')?.textContent?.trim() ?? "";

  const countText =
    container
      .querySelector('span[class^="video_information_count"]')
      ?.textContent?.trim() ?? "";

  const streamTime = countText.match(/\d{2}:\d{2}:\d{2}/)?.[0] ?? "";

  return {
    title,
    channelName,
    streamTime,
  };
}
