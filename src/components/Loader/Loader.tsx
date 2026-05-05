import style from "./Loader.module.css";
import { PacmanLoader } from "react-spinners";

export default function Loader() {
  return (
    <div className={style.backdrop}>
      <PacmanLoader color="#49dab8" />
    </div>
  );
}
