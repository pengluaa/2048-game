import { useEffect, useState } from "preact/hooks";
import Matrix from "../libs/matrix";

const matrix = new Matrix();

const Counter = () => {
  const [rows, setRows] = useState<number[][]>([]);

  const checkMatrix = () => {
    setRows([...matrix.list]);
  };

  const left = () => {
    matrix.transform("left");
    checkMatrix();
  };
  const top = () => {
    matrix.transform("top");
    checkMatrix();
  };
  const rigth = () => {
    matrix.transform("right");
    checkMatrix();
  };
  const bottom = () => {
    matrix.transform("bottom");
    checkMatrix();
  };

  useEffect(() => {
    checkMatrix();
  }, []);

  return (
    <>
      <div className="game">
        <div className="tile-wrap">
          {rows?.map((row) => (
            <>
              {row.map((item) => (
                <div key={item} className="tile">
                  <span>{item}</span>
                </div>
              ))}
            </>
          ))}
        </div>
      </div>

      <div style={{ right: 20 }} class="simulate-btns">
        <button onClick={left}>left</button>
        <button onClick={top}>top</button>
        <button onClick={rigth}>rigth</button>
        <button onClick={bottom}>bottom</button>
      </div>
    </>
  );
};

export default Counter;
