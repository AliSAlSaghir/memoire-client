import { GiSandsOfTime } from "react-icons/gi";
import { SiTinyletter } from "react-icons/si";
import { BiSolidCapsule } from "react-icons/bi";

import "./FutureMessage.css";

export default function FutureMessage() {
  return (
    <section className="future-message">
      <div className="floating-icons">
        <SiTinyletter className="icon envelope" aria-label="Envelope" />
        <GiSandsOfTime className="icon clock" aria-label="Clock" />
        <BiSolidCapsule className="icon capsule" aria-label="Capsule" />
      </div>

      <div className="centered-text">
        <h2>Send a message to your future self</h2>
        <p>
          <span className="memoire-word">Memoire</span> safely delivers it when
          the time is right.
        </p>
      </div>
    </section>
  );
}
