import { useMemos } from "@/src/hooks/useMemo";
import type { MemoItem } from "@/src/types/memo";
import styles from "./memoList.module.css";

export function MemoList() {
  const { memos, loading, deleteMemo, updateMemo, clearMemos } = useMemos();

  if (loading) {
    return <div className={styles["loading-state"]}>불러오는 중...</div>;
  }

  if (memos.length === 0) {
    return (
      <div className={styles["empty-state"]}>
        <div className={styles["empty-icon"]}>📝</div>
        <p className={styles["empty-text"]}>저장된 메모가 없습니다.</p>
        <p className={styles["empty-subtext"]}>
          방송 화면에서 'G' 키를 눌러
          <br />
          메모를 추가해 보세요!
        </p>
      </div>
    );
  }

  return (
    <div className={styles["memo-list-container"]}>
      <div className={styles["memo-list-header"]}>
        <span className={styles["memo-count"]}>전체 메모 ({memos.length})</span>
        <button className={styles["clear-all-btn"]} onClick={clearMemos}>
          비우기
        </button>
      </div>
      <div className={styles["memo-cards-scroll"]}>
        {memos.map((memo: MemoItem) => (
          <div key={memo.id} className={styles["memo-card"]}>
            <div className={styles["memo-card-header"]}>
              <span className={styles["memo-time-badge"]}>
                {memo.elapsedTime || "00:00:00"}
              </span>
              <span className={styles["memo-channel-name"]} title={memo.channelName}>
                {memo.channelName}
              </span>
              <span className={styles["memo-created-date"]}>
                {formatMemoDate(memo.createdAt)}
              </span>
              <button
                className={styles["memo-delete-btn"]}
                onClick={() => deleteMemo(memo.id)}
                title="삭제"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className={styles["memo-card-body"]}>
              <textarea
                className={styles["memo-textarea"]}
                value={memo.memo}
                onChange={(e) => updateMemo(memo.id, e.target.value)}
                placeholder="메모를 입력하세요..."
                rows={1}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatMemoDate(createdAt: number) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  }).format(createdAt);
}
