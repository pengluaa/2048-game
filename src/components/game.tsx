import { useState, useEffect } from "preact/hooks";
import { getRadomInt } from "../utils/util";
import Matrix from "../libs/matrix";

import "./game.css";
import { Fragment } from "preact/jsx-runtime";
import Storage from "../utils/storage";
const storage = new Storage();

const BEST_SCORE_KEY = "BEST_SCORE";
const SIZE = 16;
const WIN_SCORE = 2048;

type Direction = "up" | "down" | "left" | "right";

const Game = () => {
  const [list, setList] = useState<GameItem[][]>([]);
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(
    storage.get(BEST_SCORE_KEY) ?? 0
  );
  const [gameOver, setGameOver] = useState<boolean>(false); // 游戏结束
  const [gameWin, setGameWin] = useState<boolean>(false); // 游戏胜利

  const getTileClassNames = (val?: number): string => {
    const classNames: string[] = ["tile"];
    if (val) {
      classNames.push("tile-value", `tile-${val}`);
    }
    return classNames.join(" ");
  };

  const init = () => {
    const randomIndexs = [getRadomInt(0, 15), getRadomInt(0, 15)];
    // const randomIndexs = [2, 8, 16, 8, 4, 16, 4, 2, 2, 256, 2, 8, 16, 2, 4, 2]; // game over
    // const randomIndexs = [2, 8, 16, 8, 4, 16, 4, 2, 2, 256, 2, 8, 16, 0, 1024, 1024]; // game win
    const matrix = new Matrix<GameItem>({
      fill: (index) => ({
        id: index + 1,
        num: randomIndexs.includes(index) ? 2 : 0,
        // num: randomIndexs[index] ?? 2,
      }),
    });
    setList(matrix.list);
  };

  const restart = () => {
    setGameOver(false);
    setGameWin(false);
    setScore(0);
    init();
  };

  // 😀
  const transform = (values: GameItem[]) => {
    const len = values.length;
    let left: number = 0;
    let right: number = 1;
    while (left < len) {
      const item = values[right];
      if (!item) {
        break;
      }
      if (values[left].num !== 0) {
        left++;
        right = left + 1;
        continue;
      }
      if (item.num === 0) {
        right++;
        continue;
      }
      // swap
      [values[left], values[right]] = [values[right], values[left]];
      left++;
      right++;
    }
  };

  // 🙁
  const transform2 = (values: GameItem[]) => {
    const extraValues: GameItem[] = [];
    let index = 0;
    while (index < values.length) {
      if (values[index].num === 0) {
        extraValues.push(...values.splice(index, 1));
      }
      index++;
    }
    values.push(...extraValues);
  };

  // 矩阵旋转
  const rotateMatrix = (values: GameItem[][]) => {
    const rows: GameItem[][] = [];
    const len = values.length;
    for (let i = 0; i < len; i++) {
      const row: GameItem[] = [];
      for (let j = 0; j < len; j++) {
        row.push(values[j][i]);
      }
      rows.push(row);
    }
    return rows;
  };
  // 计算合并结果
  const calcResult = (row: GameItem[], direction: "left" | "right") => {
    const len = row.length;
    let left = 0;
    let right = 1;

    if (direction === "right") {
      row.reverse();
    }

    while (left < len) {
      // 位移矩阵
      transform(row);
      const v1 = row[left]?.num;
      const v2 = row[right]?.num;
      if (v1 === v2 && v1 > 0) {
        const count = row[left].num * 2;
        row[left].num = count;
        setScore(count + score);
        row[right].num = 0;
        continue;
      }
      left++;
      right++;
    }

    if (direction === "right") {
      row.reverse();
    }
  };

  const getRowIndexs = (index: number): number[] => {
    return [Math.floor(index / 4), index % 4];
  };

  const flatGameItem = (datas: GameItem[][]): GameItem[] => {
    const newList: GameItem[] = [];
    datas.forEach((rows) => newList.push(...rows));
    return newList;
  };

  // 存在相同数字相邻
  const hasSameNear = (row: number[]): boolean => {
    const len = row.length;
    let left = 0;
    let right = 1;
    while (left < len) {
      const v1 = row[left];
      const v2 = row[right];
      if (v1 === v2) {
        return true;
      }
      left++;
      right++;
    }
    return false;
  };

  // check
  const checkGame = (values: GameItem[][], nums: number[]) => {
    const checkNums: number[] = flatGameItem(values).map((item) => item.num);
    const sum = checkNums.filter((num) => num !== 0).length;

    let hasNear = true;
    //如果有空位则随机插入
    if (sum < SIZE) {
      // 如果不可移动
      if (nums.toString() !== checkNums.toString()) {
        while (true) {
          const [i1, i2] = [getRadomInt(0, 3), getRadomInt(0, 3)];
          // 如果为空
          if (list[i1][i2].num === 0) {
            list[i1][i2].num = 2;
            break;
          }
        }
      }
    }
    // 检查是否游戏结束
    else {
      for (let i = 0; i < list.length; i++) {
        const nums = list[i].map((item) => item.num);
        hasNear = hasSameNear(nums);
        if (hasNear) {
          break;
        }
      }

      // 如果没有相邻则旋转后再次判断
      if (!hasNear) {
        const rotateList = rotateMatrix(list);
        for (let i = 0; i < rotateList.length; i++) {
          const nums = rotateList[i].map((item) => item.num);
          hasNear = hasSameNear(nums);
          if (hasNear) {
            break;
          }
        }
      }
    }

    // 游戏结束
    if (!hasNear) {
      setGameOver(true);
      // 是否胜利
      setGameWin(checkNums.includes(WIN_SCORE));
    }
    setList([...values]);
  };

  const moveLeft = () => {
    const nums = flatGameItem(list).map((item) => item.num);
    list.forEach((rows) => {
      calcResult(rows, "left");
    });
    checkGame(list, nums);
  };

  const moveRight = () => {
    const nums = flatGameItem(list).map((item) => item.num);
    list.forEach((rows) => {
      calcResult(rows, "right");
    });
    checkGame(list, nums);
  };

  const moveUp = () => {
    const nums = flatGameItem(list).map((item) => item.num);
    const rows = rotateMatrix(list);
    rows.forEach((row) => {
      calcResult(row, "left");
    });
    checkGame(rotateMatrix(rows), nums);
  };

  const moveDown = () => {
    const nums = flatGameItem(list).map((item) => item.num);
    const rows = rotateMatrix(list);
    rows.forEach((row) => {
      calcResult(row, "right");
    });
    checkGame(rotateMatrix(rows), nums);
  };

  const moveHandle = (d: Direction) => {
    // 如果游戏结束
    if (gameOver) {
      return;
    }
    switch (d) {
      case "left":
        moveLeft();
        break;
      case "up":
        moveUp();
        break;
      case "right":
        moveRight();
        break;
      case "down":
        moveDown();
        break;
      default:
        break;
    }
  };

  const onKeydown = (e: KeyboardEvent) => {
    switch (e.code) {
      case "ArrowLeft":
        moveHandle("left");
        break;
      case "ArrowUp":
        moveHandle("up");
        break;
      case "ArrowRight":
        moveHandle("right");
        break;
      case "ArrowDown":
        moveHandle("down");
        break;
      default:
        break;
    }
  };

  let touchStart: Touch;
  const onTouchStart = (e: TouchEvent) => {
    touchStart = e.touches[0];
  };
  const onTouchMove = (e: TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };
  const onTouchEnd = (e: TouchEvent) => {
    const { pageX, pageY } = e.changedTouches[0];
    const mx = pageX - touchStart.pageX;
    const my = pageY - touchStart.pageY;
    const dx = Math.abs(mx);
    const dy = Math.abs(my);

    if (Math.max(dx, dy) < 20) {
      return;
    }

    // 左右滑动
    if (dx > dy) {
      mx > 0 ? moveHandle("right") : moveHandle("left");
    }
    // 上下滑动
    else {
      my > 0 ? moveHandle("down") : moveHandle("up");
    }
  };

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      storage.set(BEST_SCORE_KEY, score);
    }
  }, [score]);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", onKeydown);
    return () => {
      document.removeEventListener("keydown", onKeydown);
    };
  });

  return (
    <div className="game-page">
      <div className="game-container">
        <div className="heading">
          <h1 className="title">2048</h1>
          <div className="scores-container">
            <div className="score-container">{score}</div>
            <div className="best-container">{bestScore}</div>
          </div>
        </div>
        <div className="above-game">
          <div className="game-intro">
            合并数字到达<strong>2048!</strong>
          </div>
          <div className="restart-button" onClick={restart}>
            新游戏
          </div>
        </div>
        <div
          className="tile-container"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="tile-wrap">
            {list?.map((rows, index) => (
              <Fragment key={index}>
                {rows.map((row) => (
                  <div className={getTileClassNames(row.num)}>
                    <span>{row.num ? row.num : ""}</span>
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
          {gameOver && (
            <div class="game-over">
              <p>{gameWin ? "牛！！！" : "游戏结束！"}</p>
              <div class="lower">
                <a class="retry-button" onClick={restart}>
                  {gameWin ? "继续" : "重试"}
                </a>
              </div>
            </div>
          )}
        </div>
        <p class="game-explanation">
          <strong>如何玩:</strong>
          <span>PC端用</span>
          <strong>方向键、</strong>
          <span>移动端用</span>
          <strong>滑动屏幕方向</strong>
          <span>移动方块。当两个具有相同数字的方块接触时，它们会</span>
          <strong>合并为一个！</strong>
          <span>数字到达2048即为胜利~</span>
          <br />
          1、手指向一个方向滑动，所有格子会向那个方向运动。
          <br />
          2、相同数字的两个格子，相撞时数字会相加。
          <br />
          3、每次滑动时，空白处会随机刷新出一个数字的格子。
          <br />
          4、当界面不可运动时（当界面全部被数字填满时），游戏结束；当界面中最大数字是2048时，游戏胜利。
        </p>
      </div>
    </div>
  );
};

export default Game;
