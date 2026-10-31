export type DiffLine = {
  type: "same" | "add" | "remove";
  left?: string;
  right?: string;
  leftNo?: number;
  rightNo?: number;
};

/** Myers-inspired O(ND) line diff for side-by-side rendering. */
export function diffLines(before: string, after: string): DiffLine[] {
  const a = before.split("\n");
  const b = after.split("\n");
  const n = a.length;
  const m = b.length;
  const max = n + m;
  const v = new Map<number, number>();
  v.set(1, 0);
  const trace: Map<number, number>[] = [];

  outer: for (let d = 0; d <= max; d++) {
    const vCopy = new Map(v);
    trace.push(vCopy);
    for (let k = -d; k <= d; k += 2) {
      let x: number;
      if (k === -d || (k !== d && (v.get(k - 1) ?? 0) < (v.get(k + 1) ?? 0))) {
        x = v.get(k + 1) ?? 0;
      } else {
        x = (v.get(k - 1) ?? 0) + 1;
      }
      let y = x - k;
      while (x < n && y < m && a[x] === b[y]) {
        x++;
        y++;
      }
      v.set(k, x);
      if (x >= n && y >= m) break outer;
    }
  }

  const edits: Array<{ type: "same" | "add" | "remove"; line: string }> = [];
  let x = n;
  let y = m;
  for (let d = trace.length - 1; d >= 0; d--) {
    const vPrev = trace[d]!;
    const k = x - y;
    let prevK: number;
    if (k === -d || (k !== d && (vPrev.get(k - 1) ?? 0) < (vPrev.get(k + 1) ?? 0))) {
      prevK = k + 1;
    } else {
      prevK = k - 1;
    }
    const prevX = vPrev.get(prevK) ?? 0;
    const prevY = prevX - prevK;
    while (x > prevX && y > prevY) {
      edits.push({ type: "same", line: a[x - 1]! });
      x--;
      y--;
    }
    if (d === 0) break;
    if (x === prevX) {
      edits.push({ type: "add", line: b[prevY]! });
      y = prevY;
    } else {
      edits.push({ type: "remove", line: a[prevX]! });
      x = prevX;
    }
  }

  edits.reverse();

  const rows: DiffLine[] = [];
  let leftNo = 0;
  let rightNo = 0;
  for (const edit of edits) {
    if (edit.type === "same") {
      leftNo++;
      rightNo++;
      rows.push({
        type: "same",
        left: edit.line,
        right: edit.line,
        leftNo,
        rightNo,
      });
    } else if (edit.type === "remove") {
      leftNo++;
      rows.push({ type: "remove", left: edit.line, leftNo });
    } else {
      rightNo++;
      rows.push({ type: "add", right: edit.line, rightNo });
    }
  }
  return rows;
}
